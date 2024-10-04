import { Comment, Category, BlogPost } from '../models/Blog.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import uploadOnCloudinary from "../utils/cloudinary.js"


// Create a new blog post
export const createPost = async (req, res) => {
    try {
      const { title, content, author, categories } = req.body;
  
      let imageCloudinaryUrl = null;
      let videoCloudinaryUrl = null;
      let audioCloudinaryUrl = null;
      let documentUrls = [];
  
      // Handle image upload to Cloudinary
      if (req.files && req.files.image && req.files.image.length > 0) {
        const result = await uploadOnCloudinary(req.files.image[0].path, {
          folder: 'blog_images', // Specify a folder in Cloudinary
          resource_type: 'image',
        });
        imageCloudinaryUrl = result.secure_url;
      }
  
      // Handle video upload to Cloudinary
      if (req.files && req.files.video && req.files.video.length > 0) {
        const result = await uploadOnCloudinary(req.files.video[0].path, {
          folder: 'blog_videos',
          resource_type: 'video',
        });
        videoCloudinaryUrl = result.secure_url;
      }
  
      // Handle audio upload to Cloudinary
      if (req.files && req.files.audio && req.files.audio.length > 0) {
        const result = await uploadOnCloudinary(req.files.audio[0].path, {
          folder: 'blog_audio',
          resource_type: 'audio',
        });
        audioCloudinaryUrl = result.secure_url;
      }
  
      // Handle documents upload to Cloudinary
      if (req.files && req.files.documents && req.files.documents.length > 0) {
        for (const file of req.files.documents) {
          const result = await uploadOnCloudinary(file.path, {
            folder: 'blog_documents',
            resource_type: 'raw', // 'raw' for non-image/video/audio files
          });
          documentUrls.push({ title: file.originalname, url: result.secure_url });
        }
      }
  
      // Create the blog post document
      const newPost = new BlogPost({
        title,
        content,
        author,
        categories,
        image: imageCloudinaryUrl,
        video: videoCloudinaryUrl,
        audio: audioCloudinaryUrl,
        documents: documentUrls,
      });
  
      // Save the post
      await newPost.save();
  
      // Return the created post
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error });
    }
  };

// Get all blog posts
 export const  getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('author categories');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

// Get a blog post by ID
 export const  getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author categories comments.author');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};



export const updatePost = async (req, res) => {
  try {
    const { title, content, categories } = req.body;
    let updateFields = {};

    // Update text fields if provided
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (categories) updateFields.categories = categories;

    // Check and update image
    if (req.files && req.files.image && req.files.image.length > 0) {
      const result = await uploadOnCloudinary(req.files.image[0].path, {
        folder: 'blog_images',
        resource_type: 'image',
      });
      updateFields.image = result.secure_url; // Update image URL
    }

    // Check and update video
    if (req.files && req.files.video && req.files.video.length > 0) {
      const result = await uploadOnCloudinary(req.files.video[0].path, {
        folder: 'blog_videos',
        resource_type: 'video',
      });
      updateFields.video = result.secure_url; // Update video URL
    }

    // Check and update audio
    if (req.files && req.files.audio && req.files.audio.length > 0) {
      const result = await uploadOnCloudinary(req.files.audio[0].path, {
        folder: 'blog_audio',
        resource_type: 'audio',
      });
      updateFields.audio = result.secure_url; // Update audio URL
    }

    // Check and update documents
    if (req.files && req.files.documents && req.files.documents.length > 0) {
      let documentUrls = [];
      for (const file of req.files.documents) {
        const result = await uploadOnCloudinary(file.path, {
          folder: 'blog_documents',
          resource_type: 'raw', // Use 'raw' for documents like PDFs
        });
        documentUrls.push({ title: file.originalname, url: result.secure_url });
      }
      updateFields.documents = documentUrls; // Update document URLs
    }

    // Update the post with the new fields
    const post = await BlogPost.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    // If no post is found
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Return the updated post
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
};


// Delete a blog post
 export const  deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};

// Add a comment to a blog post
 export const  addComment = async (req, res) => {
  try {
    const { author, content } = req.body;
    const comment = new Comment({ author, content });
    const post = await BlogPost.findByIdAndUpdate(req.params.id, { $push: { comments: comment } }, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

// Update a comment
 export const  updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await BlogPost.findOneAndUpdate(
      { 'comments._id': req.params.commentId },
      { $set: { 'comments.$.content': content } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Comment not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error });
  }
};

// Delete a comment
 export const  deleteComment = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Comment not found' });
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};

// Like a blog post
 export const  likePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error });
  }
};

// Dislike a blog post
 export const  dislikePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } }, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error disliking post', error });
  }
};

// Like a comment
 export const  likeComment = async (req, res) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { 'comments._id': req.params.commentId },
      { $inc: { 'comments.$.likes': 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Comment not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error liking comment', error });
  }
};

// Dislike a comment
 export const  dislikeComment = async (req, res) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { 'comments._id': req.params.commentId },
      { $inc: { 'comments.$.dislikes': 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Comment not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error disliking comment', error });
  }
};

// Upload video (placeholder for actual implementation)
 export const  uploadVideo = async (req, res) => {
  try {
    // Handle video upload logic here
    res.status(200).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading video', error });
  }
};

// Upload PDF (placeholder for actual implementation)
 export const  uploadPDF = async (req, res) => {
  try {
    // Handle PDF upload logic here
    res.status(200).json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading PDF', error });
  }
};

// Upload audio (placeholder for actual implementation)
 export const  uploadAudio = async (req, res) => {
  try {
    // Handle audio upload logic here
    res.status(200).json({ message: 'Audio uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading audio', error });
  }
};

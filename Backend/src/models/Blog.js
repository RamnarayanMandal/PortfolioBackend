import mongoose from 'mongoose'; 

const CommentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0, // Initialize likes count
  },
  dislikes: {
    type: Number,
    default: 0, // Initialize dislikes count
  },
});

// Define the Category schema
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// Define the BlogPost schema
const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: 'default-image.jpg',
  },
  video: {
    type: String, // URL to the video
    default: null,
  },
  audio: {
    type: String, // URL to the audio file
    default: null,
  },
  documents: [
    {
      title: {
        type: String, // Title of the document
        required: true,
      },
      url: {
        type: String, // URL to the document
        required: true,
      },
    },
  ],
  likes: {
    type: Number,
    default: 0, // Initialize likes count
  },
  dislikes: {
    type: Number,
    default: 0, // Initialize dislikes count
  },
});

export const Comment = mongoose.model('Comment', CommentSchema);
export const Category = mongoose.model('Category', CategorySchema);
export const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

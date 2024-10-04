import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { FiPaperclip } from 'react-icons/fi'; // Icon for the file upload button
import Swal from 'sweetalert2';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const UpdateBlog = ({ showModal, blog }) => {
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    author: '',
    categories: '',
    image: null,
    video: null,
    audio: null,
    documents: [],
  });

  const token = localStorage.getItem('token');
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState('');

  useEffect(() => {
    if (blog) {
      setBlogData({
        title: blog.title,
        content: blog.content,
        author: blog.author,
        categories: blog.categories.join(', '), // Convert array to string for input
        image: null,
        video: null,
        audio: null,
        documents: [],
      });
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBlogData((prevData) => ({
      ...prevData,
      [selectedFileType]: file,
    }));
    setShowFileOptions(false); // Close options after selecting a file
    setSelectedFileType(''); // Reset the selected file type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();

    // Append form data
    formDataToSubmit.append('title', blogData.title);
    formDataToSubmit.append('content', blogData.content);
    formDataToSubmit.append('author', blogData.author);
    formDataToSubmit.append('categories', blogData.categories.split(',')); // Convert string back to array

    // Append the image file if it exists
    if (blogData.image) {
      formDataToSubmit.append('image', blogData.image);
    }
    // Append the video file if it exists
    if (blogData.video) {
      formDataToSubmit.append('video', blogData.video);
    }
    // Append the audio file if it exists
    if (blogData.audio) {
      formDataToSubmit.append('audio', blogData.audio);
    }
    // Append all document files if they exist
    if (blogData.documents.length > 0) {
      blogData.documents.forEach(doc => {
        formDataToSubmit.append('documents', doc);
      });
    }

    try {
      const url = blog
        ? `${BASE_URL}/api/blogs/update/${blog._id}`
        : `${BASE_URL}/api/blogs/create`;

      const method = blog ? 'put' : 'post';

      const response = await axios({
        method: method,
        url: url,
        data: formDataToSubmit,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Blog saved successfully:', response.data);

      Swal.fire({
        icon: 'success',
        title: `Blog ${blog ? 'Updated' : 'Created'}!`,
        text: `The blog has been ${blog ? 'updated' : 'created'} successfully.`,
      });

      // Reset form data
      setBlogData({
        title: '',
        content: '',
        author: '',
        categories: '',
        image: null,
        video: null,
        audio: null,
        documents: [],
      });
      showModal(false);
    } catch (error) {
      console.error('Error saving blog:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `There was an error ${blog ? 'updating' : 'creating'} the blog. Please try again.`,
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full p-4 rounded-lg shadow-lg h-[90%] overflow-y-auto">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg relative">
        <div className='flex justify-between content-center items-center'>
          <h2 className="text-2xl font-bold mb-4">{blog ? 'Update Blog' : 'Add Blog'}</h2>
          <IoMdClose onClick={() => showModal(false)} className='text-2xl cursor-pointer' />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Categories (comma-separated)</label>
          <input
            type="text"
            name="categories"
            value={blogData.categories}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea
            name="content"
            value={blogData.content}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
          />
        </div>
        {selectedFileType && (
          <div className="mb-4">
            <label className="block text-gray-700">{selectedFileType.charAt(0).toUpperCase() + selectedFileType.slice(1)} Upload</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
            />
          </div>
        )}

        <div className='flex items-center gap-4 content-center relative'>
          <button
            type="button"
            onClick={() => setShowFileOptions(!showFileOptions)}
            className="cursor-pointer"
          >
            <FiPaperclip className="mr-2 text-2xl" />
          </button>
          <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
            {blog ? 'Update Blog' : 'Add Blog'}
          </button>
          {showFileOptions && (
            <ul className=' bg-slate-600 w-auto h-40 flex flex-col items-center justify-center rounded-xl'>
              <li onClick={() => { setSelectedFileType('image'); setShowFileOptions(false); }} className='text-white p-2 hover:text-black cursor-pointer w-full text-center'>Photo</li>
              <li onClick={() => { setSelectedFileType('video'); setShowFileOptions(false); }} className='text-white p-2 hover:text-black cursor-pointer w-full text-center'>Video</li>
              <li onClick={() => { setSelectedFileType('documents'); setShowFileOptions(false); }} className='text-white p-2 hover:text-black cursor-pointer w-full text-center'>Document</li>
              <li onClick={() => { setSelectedFileType('audio'); setShowFileOptions(false); }} className='text-white p-2 hover:text-black cursor-pointer w-full text-center'>Audio</li>
            </ul>
          )}
        </div>

        
      </form>
    </div>
  );
};

export default UpdateBlog;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import { motion } from 'framer-motion';
import { FaUserCircle, FaThumbsUp, FaThumbsDown, FaRegComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const BlogComponent = () => {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const [blogs, setBlogs] = useState([]);
    const { isDarkMode } = useTheme();
    const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
    const autoScrollRef = useRef(null);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/Blogs/posts`);
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            }
        };

        fetchBlogPosts();
    }, [BASE_URL]);

    useEffect(() => {
        const startAutoScroll = () => {
            autoScrollRef.current = setInterval(() => {
                handleNextBlog();
            }, 5000);
        };

        startAutoScroll();

        return () => clearInterval(autoScrollRef.current);
    }, [currentBlogIndex]);

    const handleNextBlog = () => {
        setCurrentBlogIndex((prevIndex) =>
            prevIndex === blogs.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevBlog = () => {
        setCurrentBlogIndex((prevIndex) =>
            prevIndex === 0 ? blogs.length - 1 : prevIndex - 1
        );
        resetAutoScroll();
    };

    const resetAutoScroll = () => {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = setInterval(() => {
            handleNextBlog();
        }, 5000);
    };

    const filteredBlogs = blogs;

    const handleOnclick = (blog) => {
        console.log(blog);
        navigate("/blogDetails", { state: { blog } });
    };

    return (
        <motion.div
            className="form-container"
            initial={{ opacity: 0, scale: 0.9, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ duration: 0.5 }}
        >
            <section id="blog" className={`py-12 w-screen min-h-[70vh] ${isDarkMode ? 'bg-gray-900' : ''}`}>
                <div className="text-center mb-10">
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        My Blogs
                    </h2>
                    <span className={`block w-20 h-1 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-800'} mx-auto mt-2`}></span>
                </div>

                {filteredBlogs.length > 0 && (
                    <div className="relative flex justify-center gap-4 items-center content-center px-4">
                        <div className="flex flex-col justify-center items-start border p-4 rounded-md shadow-md overflow-hidden w-full md:w-1/2 lg:w-1/4 cursor-pointer"
                            onClick={() => handleOnclick(filteredBlogs[currentBlogIndex])}>
                            {filteredBlogs[currentBlogIndex] && (
                                <>
                                    <h1 className="text-lg md:text-2xl text-gray-800 my-2 flex justify-start items-center gap-4">
                                        <FaUserCircle /> {filteredBlogs[currentBlogIndex].author.name}
                                    </h1>
                                    <h2 className='text-xl font-bold my-2'>{filteredBlogs[currentBlogIndex].title}</h2>
                                    {filteredBlogs[currentBlogIndex].image && (
                                        <img
                                            src={filteredBlogs[currentBlogIndex].image}
                                            alt={filteredBlogs[currentBlogIndex].title}
                                            className='w-full h-96 rounded-md mb-2 object-cover'
                                        />
                                    )}
                                    <div
                                        className="line-clamp-4 overflow-hidden text-ellipsis"
                                        dangerouslySetInnerHTML={{ __html: filteredBlogs[currentBlogIndex].content }}
                                    />
                                    <div className='mt-2'>
                                        {filteredBlogs[currentBlogIndex].categories.map((category) => (
                                            <span key={category._id} className='text-blue-500 mr-2'>#{category.name}</span>
                                        ))}
                                    </div>
                                    <div className='flex items-center content-center justify-between mt-4 w-full'>
                                        <button className='flex items-center text-blue-500 mr-4'>
                                            <FaThumbsUp className='mr-1 text-2xl' />
                                            {filteredBlogs[currentBlogIndex].likes || 0}
                                        </button>
                                        <button className='flex items-center text-red-500'>
                                            <FaThumbsDown className='mr-1 text-2xl' />
                                        </button>
                                    </div>
                                    {filteredBlogs[currentBlogIndex].comments && filteredBlogs[currentBlogIndex].comments.length > 0 ? (
                                        <button className='flex items-center text-gray-500 ml-4'>
                                            <FaRegComment className='mr-1' />
                                            {filteredBlogs[currentBlogIndex].comments.length}
                                        </button>
                                    ) : (
                                        <span className='text-gray-400 ml-4'></span>
                                    )}
                                    <p className="text-gray-600 text-sm my-2">
                                        {formatDate(filteredBlogs[currentBlogIndex].createdAt)} - {formatDate(filteredBlogs[currentBlogIndex].updatedAt)}
                                    </p>
                                </>
                            )}
                        </div>
                        <button onClick={handlePrevBlog} className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full focus:outline-none ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'}`}>
                            ❮
                        </button>
                        <button onClick={handleNextBlog} className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full focus:outline-none ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'}`}>
                            ❯
                        </button>
                    </div>
                )}
            </section>
        </motion.div>
    );
};

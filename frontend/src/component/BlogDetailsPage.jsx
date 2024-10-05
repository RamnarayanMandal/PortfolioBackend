import React from 'react';
import { useTheme } from '../ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';

export const BlogDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { blog } = location.state || {};
    const { isDarkMode } = useTheme();

    // Handle back button click
    const handleBack = () => {
        navigate(-1);
    };

    if (!blog) {
        return (
            <div className={`container mx-auto p-6 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}>
                Blog not found!
            </div>
        );
    }

    return (
        <div className={`p-6 py-20  min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}>
            <Navbar />
            <div className="flex flex-col">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className={`mb-6 w-40 text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'} p-2 px-5 rounded-md focus:outline-none`}
                >
                    ⬅ Back
                </button>

                {/* Blog Image */}
                <div className='grid lg:grid-cols-2 gap-10 md:grid-cols-2  grid-cols-1 '>
                    <div className=''>
                        {blog.image && (
                            <img
                                src={blog.image} // Assuming blog.image contains the image URL
                                alt={blog.title}
                                className="w-full h-auto md:h-full object-cover rounded-xl"
                            />
                        )}
                    </div>

                    {/* Blog Content */}
                    <div className="">
                        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

                        {/* Render HTML content safely */}
                        <div className="mb-4" dangerouslySetInnerHTML={{ __html: blog.content }} />

                        {/* Display Categories */}
                        <div className='mt-2 '>
                            {blog.categories.map((category) => (
                                <span key={category._id} className='text-blue-500 mr-2 cursor-pointer'>#{category.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

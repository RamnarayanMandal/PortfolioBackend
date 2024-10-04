import React, { useEffect, useState } from 'react';
import UpdateBlog from './UpdateBlog';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_API_URL;

const Blog = () => {
    const [Blogs, setBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/Blogs/gettAllBlogs`);
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                console.error('Error fetching Blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    const handleUpdateBlog = (Blog) => {
        setSelectedBlog(Blog);
        setShowModal(true);
    };

    const handleAddBlog = () => {
        setSelectedBlog(null);
        setShowModal(true);
    };

    const handleDeleteBlog = async (Blog) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${Blog.name}. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${BASE_URL}/api/Blogs/delete/${Blog._id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setBlogs((prevBlogs) =>
                        prevBlogs.filter((cert) => cert._id !== Blog._id)
                    );
                    Swal.fire('Deleted!', `${Blog.name} has been deleted.`, 'success');
                } else {
                    throw new Error('Failed to delete the Blog.');
                }
            } catch (error) {
                console.error('Error deleting Blog:', error);
                Swal.fire('Error!', 'There was an error deleting the Blog.', 'error');
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <motion.div
            className="form-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className='flex justify-center items-center flex-col lg:px-0 md:mx-0 md:px-0 px-5 py-20'>
                <div className="flex justify-between items-center w-full lg:px-32 ">
                    <h1 className='lg:text-4xl text-2xl font-bold font-serif text-[#2C3E50]'>My Blogs</h1>
                    <button
                        onClick={handleAddBlog}
                        className="bg-pink-500 text-white font-semibold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out transform hover:bg-blue-800 hover:shadow-lg hover:scale-105">
                        Add Blog
                    </button>
                </div>

                <div className="w-full grid grid-cols-1 gap-8 lg:px-20 md:px-10 pl-8 py-5">
                    {Blogs.length > 0 ? (
                        Blogs.map((Blog, index) => (
                            <div
                                key={Blog._id}
                                className={`flex flex-col lg:flex-row items-center rounded-lg overflow-hidden p-4 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                            >
                                <div className={`w-full lg:w-1/2 flex justify-center mb-4 lg:mb-0`}>
                                    <img
                                        src={Blog.image || "https://via.placeholder.com/150"}
                                        alt={Blog.name}
                                        className="object-cover rounded-lg w-full h-full"
                                    />
                                </div>
                                <div className="w-full lg:w-1/2 lg:px-20 md:px-10 px-5">
                                    <p className="font-bold text-2xl md:text-4xl uppercase text-gray-600 tracking-wide">
                                        {Blog.name}
                                    </p>
                                    <h1 className="text-lg md:text-2xl text-gray-800 my-2">
                                        {Blog.organization}
                                    </h1>
                                    <p className="text-gray-600 mb-4">{Blog.description}</p>
                                    <p className="text-gray-600 text-sm ml-2">
                                        {formatDate(Blog.session.start)} - {formatDate(Blog.session.end)}
                                    </p>
                                    <p className="text-base text-gray-600 mt-2 text-center">
                                        <strong>Issued Date:</strong> {formatDate(Blog.issuedDate)}
                                    </p>
                                    <div className="flex justify-center items-center content-center mt-4">
                                        <button
                                            onClick={() => handleUpdateBlog(Blog)}
                                            className="Blog-btn"
                                        >
                                            Update {Blog.name}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBlog(Blog)}
                                            className="Blog-btn-delete"
                                        >
                                            Delete {Blog.name}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Blogs available.</p>
                    )}
                </div>

                {showModal && (
                    <div className='fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-75 z-50'>
                        <UpdateBlog showModal={setShowModal} Blog={selectedBlog} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Blog;

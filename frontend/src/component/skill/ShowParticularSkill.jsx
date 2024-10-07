import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../Navbar';

const ShowParticularSkill = () => {
    const location = useLocation();
    const { skills } = location.state || {}; // Get the skills data from location state

    const [selectedSkill, setSelectedSkill] = useState(null); // State to track the selected skill
    const [isDarkMode, setIsDarkMode] = useState(false); // State to handle dark mode toggle

    const handleSkillClick = (skill) => {
        setSelectedSkill(skill); // Set the selected skill when clicked
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Navbar */}
            <Navbar />
            <div className="flex flex-grow flex-col md:flex-row p-4 mt-20 lg:px-40">
                {/* Dark Mode Toggle */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={toggleDarkMode}
                        className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md shadow-md transition duration-300"
                    >
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>=
                {/* Left Section - Skills List */}
                <div className="w-full md:w-1/5 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 md:mb-0 md:mr-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b dark:border-gray-700 pb-4">Skills</h2>
                    <ul className="space-y-4">
                        {skills && skills.map((skill) => (
                            <li
                                key={skill._id}
                                className={`cursor-pointer p-3 rounded-lg text-lg font-medium transition duration-200 
                                ${selectedSkill && selectedSkill._id === skill._id
                                    ? 'bg-blue-500 text-white dark:bg-blue-700'
                                    : 'hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300'
                                }`}
                                onClick={() => handleSkillClick(skill)}
                            >
                                {skill.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Section - Skill Details */}
                <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                    {selectedSkill ? (
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{selectedSkill.name}</h2>
                            <img
                                src={selectedSkill.logo}
                                alt={selectedSkill.name}
                                className="w-24 h-24 object-contain mb-4 rounded-lg shadow-md"
                            />
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Years of Experience:</span> {selectedSkill.yearsExperience}
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300">{selectedSkill.description}</p>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Rating:</span> {selectedSkill.rating}/5
                            </p>

                            {/* Project URLs */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Projects:</h3>
                                <ul className="list-disc pl-5 space-y-2 text-blue-500 dark:text-blue-400">
                                    {selectedSkill.projectUrl.map((project) => (
                                        <li key={project._id}>
                                            {project.name ? (
                                                <a
                                                    href={project.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    {project.name}
                                                </a>
                                            ) : (
                                                "No project available"
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <p className="text-lg text-gray-800 dark:text-gray-300">Click on a skill to see the details</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowParticularSkill;

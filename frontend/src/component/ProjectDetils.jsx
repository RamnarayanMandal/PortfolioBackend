import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useTheme } from '../ThemeContext';

export const ProjectDetils = () => {
  const location = useLocation();
  const { project } = location.state || {};
  const { isDarkMode } = useTheme();

  // Carousel state for images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Navigate hook
  const navigate = useNavigate();

  // Function to handle back navigation
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (!project) {
    return (
      <div className={`text-center font-bold text-xl ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
        Project details not available
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handlers to move through carousel images
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === project.imageUrl.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? project.imageUrl.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={`container mx-auto p-6 md:p-12 pl-20 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}>
      <Navbar />
      <div className="overflow-hidden">

        {/* Back Button */}
        <button
          onClick={handleBack}
          className={`mb-6 text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'} p-2 px-5 rounded-md focus:outline-none`}
        >
          ⬅ Back
        </button>

        {/* Carousel */}
        {project.imageUrl && (
          <div className="relative">
            <img
              className="w-full h-full object-cover rounded-md"
              src={project.imageUrl[currentImageIndex]}
              alt={`${project.name} - ${currentImageIndex + 1}`}
            />

            {/* Carousel controls */}
            <button
              onClick={handlePrevImage}
              className={`absolute top-1/2 left-4 transform -translate-y-1/2 text-white p-2 rounded-full focus:outline-none ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'}`}
            >
              ❮
            </button>

            <button
              onClick={handleNextImage}
              className={`absolute top-1/2 right-4 transform -translate-y-1/2 text-white p-2 rounded-full focus:outline-none ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'}`}
            >
              ❯
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Project Name */}
          <h1 className={`text-3xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{project.name}</h1>

          {/* Project Description */}
          <p className={`mb-6 whitespace-pre-line text-sm md:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{project.description}</p>

          {/* Project Dates */}
          <div className={`text-sm md:text-base mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="font-bold">Start Date:</span> {formatDate(project.startDate.$date)}
            <br />
            <span className="font-bold">End Date:</span> {formatDate(project.endDate.$date)}
          </div>

          {/* Role */}
          <div className="mb-4">
            <h2 className={`text-lg md:text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Role: <span className="text-green-600">{project.role}</span>
            </h2>
          </div>

          {/* Technologies Used */}
          <div className="mb-6">
            <h3 className={`text-lg md:text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Technologies Used:</h3>
            <ul className="list-disc pl-5 text-sm md:text-lg">
              {project.technologiesUsed && JSON.parse(project.technologiesUsed).map((tech, index) => (
                <li key={index} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tech}</li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="flex space-x-4">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-semibold transition duration-300 transform hover:scale-105 ${isDarkMode ? 'text-blue-400 hover:text-blue-600' : 'text-blue-500 hover:text-blue-700'}`}
              >
                GitHub Repository
              </a>
            )}

            {project.liveDemoLink && (
              <a
                href={project.liveDemoLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-semibold transition duration-300 transform hover:scale-105 ${isDarkMode ? 'text-blue-400 hover:text-blue-600' : 'text-blue-500 hover:text-blue-700'}`}
              >
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetils;

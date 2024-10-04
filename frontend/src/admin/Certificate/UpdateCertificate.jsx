import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL;

const UpdateCertificate = ({ showModal, certificate }) => {
  const [certificateData, setCertificateData] = useState({
    name: '',
    description: '',
    organization: '',
    issuedDate: '',
    startDate: '',
    endDate: '',
    image: null, // To store the image file
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (certificate) {
      setCertificateData({
        name: certificate.name,
        description: certificate.description,
        organization: certificate.organization,
        issuedDate: certificate.issuedDate,
        startDate: certificate.session.start, // Assuming session start and end dates are structured this way
        endDate: certificate.session.end,
        image: null // Reset image to null on load to avoid showing previous image
      });
    }
  }, [certificate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setCertificateData((prevData) => ({
      ...prevData,
      image: e.target.files[0], // Store the image file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSubmit = new FormData();
  
    // Append form data
    formDataToSubmit.append('name', certificateData.name);
    formDataToSubmit.append('description', certificateData.description);
    formDataToSubmit.append('organization', certificateData.organization);
    formDataToSubmit.append('issuedDate', certificateData.issuedDate);
    formDataToSubmit.append('startDate', certificateData.startDate);
    formDataToSubmit.append('endDate', certificateData.endDate);
  
    // Append the image file if it exists
    if (certificateData.image) {
      formDataToSubmit.append('image', certificateData.image);
    }
  
    try {
      const url = certificate 
        ? `${BASE_URL}/api/certificates/update/${certificate._id}`  // If editing, use the update URL
        : `${BASE_URL}/api/certificates/create`;              // Otherwise, use the create URL
  
      const method = certificate ? 'put' : 'post';            // Use PUT for update and POST for create
  
      const response = await axios({
        method: method,
        url: url,
        data: formDataToSubmit,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        
      });
  
      console.log('Certificate saved successfully:', response.data);
  
      // Display success message using SweetAlert2
      Swal.fire({
        icon: 'success',
        title: `Certificate ${certificate ? 'Updated' : 'Created'}!`,
        text: `The certificate has been ${certificate ? 'updated' : 'created'} successfully.`,
      });
  
      // Reset form data
      setCertificateData({
        name: '',
        description: '',
        organization: '',
        issuedDate: '',
        startDate: '',
        endDate: '',
        image: null,
      });
      showModal(false);
    } catch (error) {
      console.error('Error saving certificate:', error);
  
      // Display error message using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `There was an error ${certificate ? 'updating' : 'creating'} the certificate. Please try again.`,
      });
    }
  };
  
  return (
    <div className="max-w-lg mx-auto p-4 rounded-lg shadow-lg h-[90%] overflow-y-auto">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
        <div className='flex justify-between content-center items-center'>
          <h2 className="text-2xl font-bold mb-4">{certificate ? 'Update Certificate' : 'Add Certificate'}</h2>
          <IoMdClose onClick={() => showModal(false)} className='text-2xl cursor-pointer' />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Certificate Name</label>
          <input
            type="text"
            name="name"
            value={certificateData.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={certificateData.description}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Organization</label>
          <input
            type="text"
            name="organization"
            value={certificateData.organization}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Issued Date</label>
          <input
            type="date"
            name="issuedDate"
            value={certificateData.issuedDate}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={certificateData.startDate}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={certificateData.endDate}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*" // Allow only image files
            onChange={handleImageChange} // Handle image file change
            required // Make image required
            className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-pink-500"
          />
        </div>

        <button type="submit" className="bg-pink-500 text-white py-2 px-4 rounded">
          {certificate ? 'Update Certificate' : 'Add Certificate'}
        </button>
      </form>
    </div>
  );
};

export default UpdateCertificate;

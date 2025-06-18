import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addStudent, updateStudent } from "../services/StudentServices";
import { useNavigate, useParams } from "react-router-dom";

function AddEditStudent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cfHandle: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch existing student data if editing
  useEffect(() => {
    const fetchStudentData = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:5000/api/students/${id}`);
          const existingStudent = await response.json();
          setFormData(existingStudent);
        } catch (error) {
          toast.error("Failed to load student data");
        }
      }
    };

    fetchStudentData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const errors = [];
    
    if (!formData.name.trim()) {
      errors.push("Name is required");
    }
    
    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Email format is invalid");
    }
    
    if (formData.phone && !/^\d{10,}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      errors.push("Please enter a valid phone number");
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (validationErrors.length > 0) {
      // Show each error as a toast notification
      validationErrors.forEach(error => {
        toast.error(error);
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (id) {
        // Update existing student
        await updateStudent(id, formData);
        toast.success("Student updated successfully!");
      } else {
        // Add new student
        await addStudent(formData);
        toast.success("Student added successfully!");
        // Reset form if adding new student
        setFormData({
          name: "",
          email: "",
          phone: "",
          cfHandle: ""
        });
      }
      // Navigate back to the student list after successful submission
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {id ? "Edit Student" : "Add New Student"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
          <input 
            id="name"
            name="name" 
            placeholder="Enter full name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input 
            id="email"
            type="email"
            name="email" 
            placeholder="example@domain.com" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone Number</label>
          <input 
            id="phone"
            name="phone" 
            placeholder="(123) 456-7890" 
            value={formData.phone} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="cfHandle" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Codeforces Handle</label>
          <input 
            id="cfHandle"
            name="cfHandle" 
            placeholder="Enter Codeforces username" 
            value={formData.cfHandle} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span>{id ? "Update" : "Add"} Student</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditStudent;
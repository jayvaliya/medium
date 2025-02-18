import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Draft = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please provide both title and content for your blog.');
      return;
    }

    setIsPublishing(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to publish a blog.');
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:8787/api/v1/blog',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('post blog data:', response.data);

      toast.success('Blog published successfully!');
      navigate('/'); // Redirect to home page or wherever you want
    } catch (error) {
      console.error('Error publishing blog:', error);
      if (axios.isAxiosError(error) && error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message || 'Failed to publish blog. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('An error occurred while publishing your blog. Please try again.');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col items-center justify-center bg-white font-Playfair">
      <div className="w-full h-screen rounded-lg shadow-md p-5 overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold md:text-4xl py-5 text-gray-800">Shaping Your Ideas</div>
          <button
            onClick={handlePublish}
            className="text-white font-inter bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-5"
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
        <div className="border-t border-b py-4">
          <input
            type="text"
            className="w-full text-4xl font-bold text-gray-800 focus:outline-none"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <textarea
          className="w-full h-[55vh] overflow-auto mt-6 text-lg text-gray-600 resize-none focus:outline-none"
          placeholder="Tell your story..."
          value={content}
          onChange={handleContentChange}
        ></textarea>
      </div>
    </div>
  );
};

export default Draft;
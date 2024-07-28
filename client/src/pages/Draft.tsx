import React, { useState } from 'react';

const Draft = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePublish = () => {
    // Handle publishing logic here
    console.log('Title:', title);
    console.log('Content:', content);
  };

  return (
    <div className="min-h-screen h-screen flex flex-col items-center justify-center bg-white font-Playfair">
      <div className="w-full h-screen rounded-lg shadow-md p-5 overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold md:text-4xl py-5 text-gray-800">Shaping Your Ideas</div>
          <button onClick={handlePublish} className="h-11 bg-green-600 text-white px-4 py-2 rounded-lg font-inter">
            Publish
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

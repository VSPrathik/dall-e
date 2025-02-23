import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-[#6469ff] text-white px-6 py-2 rounded-md hover:bg-[#4f53cc] transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;

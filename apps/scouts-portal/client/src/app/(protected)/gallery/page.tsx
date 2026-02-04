import React from 'react';

const GalleryPage = () => {
  return (
    <div className="w-full h-full p-6">
      <div className="bg-white rounded-lg shadow-lg border border-green-200 p-8">
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Gallery</h1>
          <p className="text-gray-600 mb-8">
            Photo gallery of our scouting activities and events
          </p>
          <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
            <p className="text-gray-500">
              Gallery content will be added soon. Stay tuned for amazing photos from our scout camp!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;

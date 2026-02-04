'use client'
import React from 'react';
import Image from 'next/image';
import { ArrowDownTrayIcon, MapIcon } from '@heroicons/react/24/outline';

const InstructionAboutCampingPage = () => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/assets/sindh-scouts-rules&guide-lines.webp';
    link.download = 'sindh-scouts-rules-and-guidelines.webp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full p-6">
      <div className="w-full h-full bg-white rounded-lg shadow-lg border border-green-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-green-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <MapIcon className="h-6 w-6 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Camping Guide</h2>
              <p className="text-sm text-gray-600">Sindh Scouts rules and guidelines for camping</p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Download</span>
          </button>
        </div>

        {/* Image Content */}
        <div className="p-4 flex justify-center items-center" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="max-w-full max-h-full overflow-auto">
            <Image
              src="/assets/sindh-scouts-rules&guide-lines.webp"
              alt="Sindh Scouts Rules and Guidelines"
              width={800}
              height={1200}
              className="object-contain rounded-lg shadow-md max-w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionAboutCampingPage;

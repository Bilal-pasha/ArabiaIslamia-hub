"use client";
import React, { useState } from "react";
import { DocumentIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  description?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, title, description }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg border border-green-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-green-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <DocumentIcon className="h-6 w-6 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
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

      {/* PDF Content */}
      <div className="relative w-full" style={{ height: 'calc(100vh - 200px)' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-6">
              <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Unable to load PDF
              </h3>
              <p className="text-gray-600 mb-4">
                The PDF file could not be displayed in your browser.
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0 rounded-b-lg"
            title={title}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
};

export default PDFViewer;

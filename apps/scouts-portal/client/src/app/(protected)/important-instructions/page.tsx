import React from 'react';
import PDFViewer from '@/components/PDFViewer/PDFViewer';

const ImportantInstructionsPage = () => {
  return (
    <div className="w-full h-full p-6">
      <PDFViewer
        pdfUrl="/assets/guidelines.pdf"
        title="Guidelines"
        description="Essential guidelines and instructions for all participants"
      />
    </div>
  );
};

export default ImportantInstructionsPage;

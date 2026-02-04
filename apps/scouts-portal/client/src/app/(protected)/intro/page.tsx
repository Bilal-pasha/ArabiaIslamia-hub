import React from 'react';
import PDFViewer from '@/components/PDFViewer/PDFViewer';

const IntroPage = () => {
  return (
    <div className="w-full h-full p-6">
      <PDFViewer
        pdfUrl="/assets/ScoutIntroproposal.pdf"
        title="Scout Introduction & Proposal"
        description="Learn about our scouting program and its objectives"
      />
    </div>
  );
};

export default IntroPage;

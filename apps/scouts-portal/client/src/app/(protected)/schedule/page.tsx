import React from 'react';
import PDFViewer from '@/components/PDFViewer/PDFViewer';

const SchedulePage = () => {
  return (
    <div className="w-full h-full p-6">
      <PDFViewer
        pdfUrl="/assets/Scout Intro proposal.pdf"
        title="Camp Schedule"
        description="Detailed schedule of all camp activities and events"
      />
    </div>
  );
};

export default SchedulePage;

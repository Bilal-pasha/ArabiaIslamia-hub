import React, { forwardRef } from 'react';
import Image from 'next/image';

const Invoice = forwardRef(({ student }: any, ref: any) => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

  return (
  <div style={{ display: 'none' }}>
    <div ref={ref} className="p-8 border border-gray-300 rounded-md shadow-lg max-w-3xl mx-auto font-poppins">
        {/* Header Section */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-col items-center">
            <Image 
              src="https://arabiaislamia.org/static/media/Logo.d8177b439b150086839e.png" 
              alt="logoImage" 
              width={100}  
              height={80} 
            />
            <p className="font-urduNastaliq text-2xl text-center">
              جامعہ عربیہ اسلامیہ 
              <span className="text-xs block mt-3">اسکاؤٹ کالونی</span>
            </p>
          </div>
        </div>

        {/* Invoice Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-medium mb-2">School Fees Invoice</h1>
          <p className="text-gray-600">
            Date: {date.toLocaleString('en-GB', options)} {/* Formats to "25 September 2024" */}
          </p>
        </div>

        {/* Student Information Section */}
        <div className="mb-6 border-b pb-4">
      <h2 className="text-xl font-semibold mb-4">Student Information</h2>
      <table className="w-full text-left text-sm border border-gray-300">
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="font-semibold px-4 py-2">Student&apos;s Name:</td>
            <td className="px-4 py-2">{student?.name}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="font-semibold px-4 py-2">Father&apos;s Name:</td>
            <td className="px-4 py-2">{student?.fatherName}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="font-semibold px-4 py-2">ID Number:</td>
            <td className="px-4 py-2">{student?.rollNumber}</td>
          </tr>
          <tr>
            <td className="font-semibold px-4 py-2">Total Fees:</td>
            <td className="px-4 py-2">{student?.fees}</td>
          </tr>
        </tbody>
      </table>
    </div>


        {/* Fee Status Section */}
        <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Fee Status</h2>
      <table className="w-full text-left text-xs  border border-gray-300">
        <thead>
          <tr>
            <th className="border-b p-1">Month</th>
            <th className="border-b p-1">Status</th>
          </tr>
        </thead>
        <tbody>
      {student?.feesStatusChart?.map((m: any, index:number) => (
        <tr key={m.month + index} className="border-b border-gray-200">
          <td className="p-2 text-gray-800 font-medium">{m.month}</td>
          <td className={`p-2 ${m.status === 'Paid' ? 'text-green-600' : 'text-red-600'} font-semibold`}>
            {m.status}
          </td>
        </tr>
      ))}
    </tbody>

      </table>
    </div>



        {/* Signature Section */}
        <div className="flex justify-between items-center">
          <div></div>
        <div>
            <p className="font-semibold text-xs">Signature of Registrar</p>
            <div className="mt-6 w-48 border-t border-gray-400"></div> {/* Line for signature */}
          </div>
        </div>
      </div>
</div>
)
}
);
Invoice.displayName = 'School Fees Invoice';

export default Invoice;

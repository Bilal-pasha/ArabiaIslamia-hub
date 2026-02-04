"use client"
import { useRouter } from 'next/navigation';

const ClassPage = ({classSlug}:any) => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-50 via-white to-green-50">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center border border-green-200">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to {classSlug.replace(/-/g, ' ')} Class
        </h1>
        <p className="mt-4 text-gray-600">
          This is the dynamic page for {classSlug.replace(/-/g, ' ')}.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-8 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ClassPage;

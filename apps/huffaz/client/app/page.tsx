import Link from 'next/link';

export default function HuffazHubPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Huffaz Section</h1>
      <p className="text-lg text-gray-600 mb-8">Arabia Islamia</p>
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/registration/signin"
          className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          Registration
        </Link>
        <Link
          href="/fees"
          className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          Fees
        </Link>
        <Link
          href="/attendance"
          className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          Attendance
        </Link>
      </div>
      <a href="/" className="mt-8 text-blue-600 hover:underline">
        ← Main Website
      </a>
    </main>
  );
}

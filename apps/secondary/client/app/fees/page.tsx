import Link from 'next/link';

export default function SecondaryFeesPage() {
  return (
    <main className="min-h-screen w-full min-w-0 flex flex-col items-center justify-center px-4 py-8 sm:p-8 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center">Secondary Fees</h1>
      <p className="text-gray-600 text-center text-sm sm:text-base">Coming soon</p>
      <Link href="/" className="mt-8 text-blue-600 hover:underline text-sm sm:text-base">
        ← Back to Secondary Hub
      </Link>
    </main>
  );
}

import Link from 'next/link';

export default function SecondaryFeesPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Secondary Fees</h1>
      <p className="text-gray-600">Coming soon</p>
      <Link href="/" className="mt-8 text-blue-600 hover:underline">
        ← Back to Secondary Hub
      </Link>
    </main>
  );
}

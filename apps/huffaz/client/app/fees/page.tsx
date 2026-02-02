import Link from 'next/link';

export default function HuffazFeesPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Huffaz Fees</h1>
      <p className="text-gray-600">Fees management — Coming soon</p>
      <Link href="/" className="mt-8 text-blue-600 hover:underline">
        ← Back to Huffaz Hub
      </Link>
    </main>
  );
}

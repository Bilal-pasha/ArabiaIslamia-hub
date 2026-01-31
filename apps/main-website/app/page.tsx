export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Arabia Islamia</h1>
      <p className="text-lg text-gray-600 mb-8">Educational Portal</p>
      <div className="flex gap-4">
        <a
          href="https://huffaz.example.com"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Huffaz Section
        </a>
        <a
          href="https://secondary.example.com"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Secondary Section
        </a>
      </div>
    </main>
  );
}

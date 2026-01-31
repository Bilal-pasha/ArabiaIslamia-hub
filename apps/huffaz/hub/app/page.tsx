export default function HuffazHub() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Huffaz Section</h1>
      <p className="text-lg text-gray-600 mb-8">Arabia Islamia</p>
      <div className="grid gap-4 md:grid-cols-3">
        <a
          href="https://registration.huffaz.example.com"
          className="p-6 border rounded-lg hover:bg-gray-50"
        >
          Registration
        </a>
        <a
          href="https://fees.huffaz.example.com"
          className="p-6 border rounded-lg hover:bg-gray-50"
        >
          Fees
        </a>
        <a
          href="https://attendance.huffaz.example.com"
          className="p-6 border rounded-lg hover:bg-gray-50"
        >
          Attendance
        </a>
      </div>
      <a href="https://example.com" className="mt-8 text-blue-600 hover:underline">
        ← Main Website
      </a>
    </main>
  );
}

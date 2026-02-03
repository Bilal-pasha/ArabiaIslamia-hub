'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/utils/axios-instance';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post<{ user?: unknown; accessToken?: string; message?: string }>(
        '/api/auth/register',
        { name, email, password }
      );
      if (data.user ?? data.accessToken) window.location.href = '/';
      else alert(data.message || 'Registration failed');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Sign Up — Huffaz</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm">
          Have an account? <Link href="/registration/signin" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
        <Link href="/" className="block mt-4 text-blue-600 hover:underline">← Back</Link>
      </div>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { Input, PasswordInput } from '@arabiaaislamia/ui';

interface SignUpFormProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignUpForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
}: SignUpFormProps) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Sign Up — Huffaz</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <PasswordInput
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
    </>
  );
}

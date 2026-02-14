'use client';

import Link from 'next/link';
import { Input, PasswordInput } from '@arabiaaislamia/ui';

interface SignInFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignInForm({ email, setEmail, password, setPassword, onSubmit }: SignInFormProps) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Sign In — Huffaz</h1>
      <form onSubmit={onSubmit} className="space-y-4">
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-sm">
        No account? <Link href="/registration/signup" className="text-blue-600 hover:underline">Sign up</Link>
      </p>
      <Link href="/" className="block mt-4 text-blue-600 hover:underline">← Back</Link>
    </>
  );
}

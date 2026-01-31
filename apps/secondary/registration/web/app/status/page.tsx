'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdmissionStatusPage() {
  const [applicationId, setApplicationId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // TODO: Connect to API when backend is ready
    await new Promise((r) => setTimeout(r, 800));
    setStatus('not-found');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Admission Form
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8">
          <h1 className="font-serif text-2xl text-slate-800 mb-2">Check Admission Status</h1>
          <p className="text-slate-500 text-sm mb-6">
            Enter your application number to view your admission status.
          </p>
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Application Number</label>
              <input
                type="text"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                placeholder="e.g. ARB-XXXXXX"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2.5 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-70 transition"
            >
              {status === 'loading' ? 'Checking...' : 'Check Status'}
            </button>
          </form>
          {status === 'not-found' && (
            <p className="mt-4 text-sm text-amber-600">
              No application found with this number. Please verify and try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

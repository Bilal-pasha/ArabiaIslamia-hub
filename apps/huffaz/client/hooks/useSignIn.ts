'use client';

import { useState, useCallback } from 'react';
import { login } from '@/services/auth/auth.service';

export function useSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const data = await login(email, password);
        if (data.accessToken) window.location.href = '/';
        else alert(data.message || 'Login failed');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Login failed');
      }
    },
    [email, password]
  );

  return { email, setEmail, password, setPassword, handleSubmit };
}

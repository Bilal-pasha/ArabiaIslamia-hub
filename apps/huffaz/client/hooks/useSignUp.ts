'use client';

import { useState, useCallback } from 'react';
import { signUp } from '@/services/auth/auth.service';

export function useSignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const data = await signUp(name, email, password);
        if (data.user ?? data.accessToken) window.location.href = '/';
        else alert(data.message || 'Registration failed');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Registration failed');
      }
    },
    [name, email, password]
  );

  return { name, setName, email, setEmail, password, setPassword, handleSubmit };
}

'use client';

import { useSignIn } from '@/hooks';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  const { email, setEmail, password, setPassword, handleSubmit } = useSignIn();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <SignInForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}

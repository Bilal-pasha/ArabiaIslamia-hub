'use client';

import { useSignUp } from '@/hooks';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default function SignUpPage() {
  const { name, setName, email, setEmail, password, setPassword, handleSubmit } = useSignUp();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <SignUpForm
          name={name}
          setName={setName}
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

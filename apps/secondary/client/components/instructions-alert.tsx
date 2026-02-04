'use client';

import { Alert, AlertTitle, AlertDescription } from '@arabiaaislamia/ui';

export function InstructionsAlert() {
  return (
    <Alert className="mb-6 sm:mb-8 border-amber-400/25 bg-amber-500/10 backdrop-blur shadow-md w-full min-w-0">
      <AlertTitle className="text-amber-200 font-semibold">Instructions</AlertTitle>
      <AlertDescription>
        <ul className="mt-1.5 space-y-1 text-sm text-amber-100/95">
          <li>• Read all fields and ensure information matches your documents.</li>
          <li>• Provide an active mobile number and correct email.</li>
          <li>• Save your application number after submission.</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}

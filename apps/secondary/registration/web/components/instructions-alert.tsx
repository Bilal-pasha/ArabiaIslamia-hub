'use client';

import { Alert, AlertTitle, AlertDescription } from '@arabiaaislamia/ui';

export function InstructionsAlert() {
  return (
    <Alert className="mb-6 sm:mb-8 border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/50 shadow-sm">
      <AlertTitle className="text-amber-900 font-semibold">Instructions</AlertTitle>
      <AlertDescription>
        <ul className="mt-1.5 space-y-1 text-sm text-amber-800">
          <li>• Read all fields and ensure information matches your documents.</li>
          <li>• Provide an active mobile number and correct email.</li>
          <li>• Save your application number after submission.</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}

import { GlobalLoading } from '@arabiaaislamia/animations';

/**
 * Global loading UI for the secondary app (route transitions).
 * Uses the shared Lottie animation from @arabiaaislamia/animations.
 */
export default function Loading() {
  return (
    <GlobalLoading className="min-h-screen w-full flex items-center justify-center bg-background" />
  );
}

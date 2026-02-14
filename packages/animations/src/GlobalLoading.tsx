'use client';

import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimationData from './LoadingAnimation.json';

// Cast for compatibility with @types/react ReactNode (ReactPortal) strictness
const LottiePlayer = Lottie as React.ComponentType<{
  animationData: object;
  loop?: boolean;
  style?: React.CSSProperties;
}>;

export interface GlobalLoadingProps {
  /** Optional class name for the wrapper (e.g. for background). */
  className?: string;
  /** Width of the animation in pixels. Default 200. */
  width?: number;
  /** Height of the animation in pixels. Default 200. */
  height?: number;
}

const defaultWrapperStyle: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fafafa',
};

/**
 * Full-screen loading UI using the shared Lottie animation.
 * Use as the default export in app/loading.tsx for global route loading state.
 */
export function GlobalLoading({
  className = '',
  width = 500,
  height = 500,
}: GlobalLoadingProps) {
  return (
    <div
      className={className}
      style={defaultWrapperStyle}
      role="status"
      aria-label="Loading"
    >
      <LottiePlayer
        animationData={loadingAnimationData as object}
        loop
        style={{ width, height }}
      />
    </div>
  );
}

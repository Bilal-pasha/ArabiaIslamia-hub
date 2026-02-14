'use client';

import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimationData from './LoadingAnimation.json';

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
  width = 200,
  height = 200,
}: GlobalLoadingProps): React.ReactElement {
  return React.createElement(
    'div',
    {
      className,
      style: defaultWrapperStyle,
      role: 'status',
      'aria-label': 'Loading',
    },
    React.createElement(Lottie, {
      animationData: loadingAnimationData as object,
      loop: true,
      style: { width, height },
    })
  );
}

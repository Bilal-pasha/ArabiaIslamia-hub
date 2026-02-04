'use client';

import * as React from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  /** Optional fallback to show during SSR. Default: null. */
  fallback?: React.ReactNode;
}

/**
 * Renders children only on the client. Use for components that depend on browser APIs
 * or to avoid hydration mismatches (e.g. with next/dynamic or third-party libs).
 */
const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
ClientOnly.displayName = 'ClientOnly';

export { ClientOnly };

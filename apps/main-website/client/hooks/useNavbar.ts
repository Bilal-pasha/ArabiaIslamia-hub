'use client';

import { useState, useRef, useCallback } from 'react';

const CLOSE_DELAY_MS = 120;

export function useNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const appsCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const appsHandleEnter = useCallback(() => {
    if (appsCloseTimeoutRef.current) {
      clearTimeout(appsCloseTimeoutRef.current);
      appsCloseTimeoutRef.current = null;
    }
    setAppsOpen(true);
  }, []);

  const appsHandleLeave = useCallback(() => {
    appsCloseTimeoutRef.current = setTimeout(() => setAppsOpen(false), CLOSE_DELAY_MS);
  }, []);

  return { mobileOpen, setMobileOpen, appsOpen, appsHandleEnter, appsHandleLeave };
}

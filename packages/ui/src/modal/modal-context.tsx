'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import type {
  ModalState,
  ConfirmationModalOptions,
  AlertModalOptions,
  CustomModalOptions,
} from './modal-types';
import {
  ConfirmationModal,
  AlertModal,
  CustomModal,
} from './modal-renderers';

interface ModalContextValue {
  confirmation: (options: ConfirmationModalOptions) => void;
  alert: (options: AlertModalOptions) => void;
  custom: (options: CustomModalOptions) => void;
  close: () => void;
  isOpen: boolean;
  state: ModalState;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalState>(null);

  const close = useCallback(() => {
    setState(null);
  }, []);

  const confirmation = useCallback((options: ConfirmationModalOptions) => {
    setState({ category: 'confirmation', options });
  }, []);

  const alert = useCallback((options: AlertModalOptions) => {
    setState({ category: 'alert', options });
  }, []);

  const custom = useCallback((options: CustomModalOptions) => {
    setState({ category: 'custom', options });
  }, []);

  const value: ModalContextValue = {
    confirmation,
    alert,
    custom,
    close,
    isOpen: state !== null,
    state,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRenderer state={state} onClose={close} />
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return ctx;
}

function ModalRenderer({
  state,
  onClose,
}: {
  state: ModalState;
  onClose: () => void;
}) {
  if (!state) return null;

  if (state.category === 'confirmation') {
    return (
      <ConfirmationModal
        options={state.options}
        onClose={onClose}
      />
    );
  }

  if (state.category === 'alert') {
    return (
      <AlertModal
        options={state.options}
        onClose={onClose}
      />
    );
  }

  if (state.category === 'custom') {
    return (
      <CustomModal
        options={state.options}
        onClose={onClose}
      />
    );
  }

  return null;
}

import type { ReactNode } from 'react';

export type ModalCategory = 'custom' | 'confirmation' | 'alert';

export interface ConfirmationModalOptions {
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  contentClassName?: string;
  cancelClassName?: string;
  confirmIcon?: ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface AlertModalOptions {
  title: string;
  description?: ReactNode;
  okText?: string;
  contentClassName?: string;
  onOk?: () => void;
}

export interface CustomModalOptions {
  content: ReactNode;
  contentClassName?: string;
  showClose?: boolean;
  onClose?: () => void;
}

export type ModalState =
  | { category: 'confirmation'; options: ConfirmationModalOptions }
  | { category: 'alert'; options: AlertModalOptions }
  | { category: 'custom'; options: CustomModalOptions }
  | null;

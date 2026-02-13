'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/alert-dialog';
import {
  Dialog,
  DialogContent,
} from '../components/dialog';
import { Button } from '../components/button';
import type {
  ConfirmationModalOptions,
  AlertModalOptions,
  CustomModalOptions,
} from './modal-types';

interface ConfirmationModalProps {
  options: ConfirmationModalOptions;
  onClose: () => void;
}

export function ConfirmationModal({ options, onClose }: ConfirmationModalProps) {
  const [loading, setLoading] = useState(false);
  const {
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    contentClassName,
    cancelClassName,
    confirmIcon,
    onConfirm,
    onCancel,
  } = options;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Caller should toast error; we keep dialog open
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <AlertDialog open onOpenChange={(open) => !open && handleCancel()}>
      <AlertDialogContent className={contentClassName}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={cancelClassName}
            disabled={loading}
          >
            {cancelText}
          </AlertDialogCancel>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Please wait…' : confirmIcon ? (
              <>
                {confirmIcon}
                <span className="ml-2">{confirmText}</span>
              </>
            ) : (
              confirmText
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface AlertModalProps {
  options: AlertModalOptions;
  onClose: () => void;
}

export function AlertModal({ options, onClose }: AlertModalProps) {
  const { title, description, okText = 'OK', contentClassName, onOk } = options;

  const handleOk = () => {
    onOk?.();
    onClose();
  };

  return (
    <AlertDialog open onOpenChange={(open) => !open && handleOk()}>
      <AlertDialogContent className={contentClassName}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={handleOk}>{okText}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface CustomModalProps {
  options: CustomModalOptions;
  onClose: () => void;
}

export function CustomModal({ options, onClose }: CustomModalProps) {
  const { content, contentClassName, showClose = true, onClose: optionsOnClose } = options;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      optionsOnClose?.();
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className={contentClassName} showClose={showClose}>
        {content}
      </DialogContent>
    </Dialog>
  );
}

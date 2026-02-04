"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Button,
} from "@arabiaaislamia/ui";
import { useEffect, useState } from "react";

interface NotificationModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  text: string;
}

export function NotificationModal({
  openModal,
  setOpenModal,
  text,
}: NotificationModalProps) {
  const [isVisible, setIsVisible] = useState(openModal);

  useEffect(() => {
    if (openModal) {
      setIsVisible(true);
    }
  }, [openModal]);

  const handleClose = () => {
    setOpenModal(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showClose={true} className={openModal ? "opacity-100" : "opacity-0"}>
        <DialogHeader>
          <DialogTitle>Notification</DialogTitle>
          <DialogDescription>{text}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <p className="text-base leading-relaxed text-muted-foreground">{text}</p>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

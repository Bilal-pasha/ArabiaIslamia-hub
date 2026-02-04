"use client";

import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";

interface NotificationModal {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  text: string;
}

export function NotificationModal({
  openModal,
  setOpenModal,
  text,
}: NotificationModal) {
  const [isVisible, setIsVisible] = useState(openModal);

  useEffect(() => {
    if (openModal) {
      setIsVisible(true);
    }
  }, [openModal]);

  const handleClose = () => {
    setOpenModal(false);
    setTimeout(() => setIsVisible(false), 300); // Wait for the transition to finish
  };

  return (
    <>
      <Modal
        dismissible
        show={isVisible}
        onClose={handleClose}
        className={`transition-opacity duration-1000 ${openModal ? 'opacity-100' : 'opacity-0'}`}
      >
        <Modal.Header>Notification</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {text}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

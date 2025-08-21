import React, { useCallback, useRef } from 'react';
import Button from './Button';

interface ConfirmPopoverProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmPopover: React.FC<ConfirmPopoverProps> = ({ open, message, onConfirm, onCancel }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-100"
      onClick={handleBackdropClick}
    >
      <div
        ref={boxRef}
        className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-xs flex flex-col items-center">
        <p className="mb-4 text-center text-gray-800">{message}</p>
        <div className="flex gap-4">
          <Button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            Yes
          </Button>
          <Button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      actions={
        <>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this {itemName}? This action cannot be undone.
          </p>
        </div>
      </div>
    </Modal>
  );
}
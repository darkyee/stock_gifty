import React from 'react';
import { Modal } from './Modal';
import { Download, ExternalLink } from 'lucide-react';
import { Certificate } from '../../types';

interface CertificateSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate;
  onDownload: () => Promise<void>;
  onViewDetails: () => void;
}

export function CertificateSuccessModal({
  isOpen,
  onClose,
  certificate,
  onDownload,
  onViewDetails,
}: CertificateSuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Certificate Created Successfully!"
      actions={
        <div className="flex gap-4 w-full justify-end">
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={onViewDetails}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <ExternalLink className="w-4 h-4" />
            View Details
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Your stock gift certificate for {certificate.recipientName} has been created successfully.
          You can now download it as a PDF or view its details.
        </p>
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">Certificate Details:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Stock Symbol: {certificate.stockSymbol}</li>
            <li>Shares: {certificate.shares}</li>
            <li>Purchase Price: {certificate.currency === 'CUSTOM' 
              ? certificate.customCurrencySymbol 
              : { USD: '$', EUR: '€', GBP: '£' }[certificate.currency] || '$'}{certificate.purchasePrice}</li>
            <li>Purchase Date: {new Date(certificate.purchaseDate).toLocaleDateString()}</li>
            <li>Redeem Date: {new Date(certificate.redeemDate).toLocaleDateString()}</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
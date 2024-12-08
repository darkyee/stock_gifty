import React, { useState } from 'react';
import { Certificate } from '../../types';
import { Download, Trash2, ExternalLink, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { DeleteConfirmationModal } from '../ui/DeleteConfirmationModal';
import { exportCertificateToPDF } from '../../utils/pdfExport';

interface GiftCardProps {
  gift: Certificate;
  onDelete: (id: string) => void;
  onViewDetails: (gift: Certificate) => void;
}

export function GiftCard({ gift, onDelete, onViewDetails }: GiftCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

  const handleDelete = () => {
    onDelete(gift.id);
    setShowDeleteModal(false);
  };

  const handleDownload = async () => {
    await exportCertificateToPDF(gift);
  };

  const handleShareClick = async () => {
    const url = `${window.location.origin}/track/${gift.id}`;
    await navigator.clipboard.writeText(url);
    setShowCopiedTooltip(true);
    setTimeout(() => setShowCopiedTooltip(false), 2000);
  };

  const currencySymbol = gift.currency === 'CUSTOM' 
    ? gift.customCurrencySymbol 
    : { USD: '$', EUR: '€', GBP: '£' }[gift.currency] || '$';

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
<h3 className="text-lg font-semibold text-gray-900">{gift["stock Symbol"]}</h3>
              <p className="text-sm text-gray-500">To: {gift.recipientName}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {gift.shares} {gift.shares === 1 ? 'share' : 'shares'}
              </p>
              <p className="text-sm text-gray-500">
                {currencySymbol}{gift.purchasePrice}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Purchase Date: {format(new Date(gift.purchaseDate), 'MMM d, yyyy')}
            </p>
            <p className="text-sm text-gray-600">
              Redeem Date: {format(new Date(gift.redeemDate), 'MMM d, yyyy')}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Download Certificate"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Delete Gift"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={handleShareClick}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Share Link"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {showCopiedTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded">
                    Copied!
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => onViewDetails(gift)}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
            >
              View Details
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName="gift certificate"
      />
    </>
  );
}
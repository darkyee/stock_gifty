import React, { useState, useRef } from 'react';
import { Certificate, TextFieldConfig } from '../types/index';
import { TemplateSelector } from './TemplateSelector';
import { CertificatePreview } from './CertificatePreview';
import { TextFieldCustomization } from './TextFieldCustomization';
import { Calendar, DollarSign } from 'lucide-react';
import { CertificateSuccessModal } from './ui/CertificateSuccessModal';
import { exportCertificateToPDF } from '../utils/pdfExport';
import { StockSymbolSearch } from './StockSymbolSearch';
import { useCurrency } from '../hooks/useCurrency';

interface SimpleEditorProps {
  onSave: (certificate: Certificate) => void;
}

const defaultTextConfig: { [key: string]: TextFieldConfig } = {
  title: {
    fontSize: 40,
    fontFamily: 'Arial',
    textAlign: 'center',
    enabled: true,
    customLabel: 'Stock Gift Certificate',
  },
  recipient: {
    fontSize: 20,
    fontFamily: 'Arial',
    textAlign: 'center',
    enabled: true,
    customLabel: 'This certifies that',
  },
  shares: {
    fontSize: 20,
    fontFamily: 'Arial',
    textAlign: 'center',
    enabled: true,
    customLabel: 'has been gifted',
    customSuffix: 'share(s) of',
  },
  sender: {
    fontSize: 20,
    fontFamily: 'Arial',
    textAlign: 'center',
    enabled: true,
    customLabel: 'by',
  },
  dates: {
    fontSize: 16,
    fontFamily: 'Arial',
    textAlign: 'left',
    enabled: true,
    priceLabel: 'Purchase Price',
    purchaseDateLabel: 'Purchase Date',
    redeemDateLabel: 'Redeem Date',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Arial',
    textAlign: 'center',
    enabled: true,
  },
  signatures: {
    fontSize: 14,
    fontFamily: 'Arial',
    textAlign: 'center',
    enabled: true,
    customLabel: 'Signatures',
    senderLabel: "Sender's Signature",
    recipientLabel: "Recipient's Signature",
  },
};

export function SimpleEditor({ onSave }: SimpleEditorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('classic');
  const [overlayColor, setOverlayColor] = useState('#ffffff');
  const [overlayOpacity, setOverlayOpacity] = useState(0.85);
  const [showTextCustomization, setShowTextCustomization] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCertificate, setCreatedCertificate] = useState<Certificate | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { currency } = useCurrency();

  const [formData, setFormData] = useState<Partial<Certificate>>({
    stockSymbol: '',
    shares: 1,
    purchasePrice: 0,
    currency,
    customCurrencySymbol: '$',
    purchaseDate: new Date(),
    redeemDate: new Date(),
    recipientName: '',
    senderName: '',
    message: '',
    signatures: {
      enabled: true,
      senderLabel: "Sender's Signature",
      recipientLabel: "Recipient's Signature",
    },
    qrCodes: {
      verification: {
        enabled: true,
        label: 'Scan to verify authenticity',
      },
      tracking: {
        enabled: true,
        label: 'Scan to track stock value',
      },
    },
    textConfig: defaultTextConfig,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: new Date(value),
    }));
  };

  const handleTextConfigChange = (fieldId: string, config: TextFieldConfig) => {
    setFormData((prev) => ({
      ...prev,
      textConfig: {
        ...prev.textConfig,
        [fieldId]: config,
      },
    }));
  };

  const handleSubmit = () => {
    if (!formData.stockSymbol || !formData.recipientName || !formData.senderName) {
      alert('Please fill in all required fields');
      return;
    }

    const certificate: Certificate = {
      id: Date.now().toString(),
      ...formData as Certificate,
    };

    setCreatedCertificate(certificate);
    setShowSuccessModal(true);
  };

  const handleDownload = async () => {
    if (createdCertificate && previewRef.current) {
      try {
        await exportCertificateToPDF(createdCertificate, previewRef.current);
      } catch (error) {
        console.error('Failed to download certificate:', error);
        alert('Failed to download certificate. Please try again.');
      }
    }
  };

  const handleSaveAndClose = () => {
    if (createdCertificate) {
      onSave(createdCertificate);
      setShowSuccessModal(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Create Stock Gift Certificate</h2>
          <button
            onClick={() => setShowTextCustomization(!showTextCustomization)}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            {showTextCustomization ? 'Hide Text Options' : 'Customize Text'}
          </button>
        </div>

        {showTextCustomization ? (
          <div className="space-y-4">
            {Object.entries(formData.textConfig || {}).map(([fieldId, config]) => (
              <TextFieldCustomization
                key={fieldId}
                fieldId={fieldId}
                config={config}
                defaultLabel={fieldId.charAt(0).toUpperCase() + fieldId.slice(1)}
                onChange={handleTextConfigChange}
              />
            ))}
          </div>
        ) : (
          <>
            <TemplateSelector
              selectedId={selectedTemplateId}
              onSelect={setSelectedTemplateId}
              onBackgroundUpload={() => {}}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Background Overlay</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <input
                    type="color"
                    value={overlayColor}
                    onChange={(e) => setOverlayColor(e.target.value)}
                    className="mt-1 block w-full h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="mt-1 block w-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Recipient Name *</label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sender Name *</label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Symbol *</label>
                <StockSymbolSearch
                  value={formData.stockSymbol}
                  onChange={(symbol) => setFormData((prev) => ({ ...prev, stockSymbol: symbol }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Shares *</label>
                <input
                  type="number"
                  name="shares"
                  value={formData.shares}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Price *</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Currency *</label>
                <div className="mt-1 flex gap-2">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                  {formData.currency === 'CUSTOM' && (
                    <input
                      type="text"
                      name="customCurrencySymbol"
                      value={formData.customCurrencySymbol}
                      onChange={handleInputChange}
                      placeholder="Symbol"
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Date *</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate?.toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange('purchaseDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Redeem Date *</label>
                <input
                  type="date"
                  name="redeemDate"
                  value={formData.redeemDate?.toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange('redeemDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Custom Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter a personal message..."
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">QR Codes & Signatures</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-700">Verification QR Code</label>
                    <p className="text-sm text-gray-500">Allow certificate verification</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.qrCodes?.verification.enabled}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      qrCodes: {
                        ...prev.qrCodes,
                        verification: {
                          ...prev.qrCodes?.verification,
                          enabled: e.target.checked,
                        },
                      },
                    }))}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-700">Tracking QR Code</label>
                    <p className="text-sm text-gray-500">Show real-time stock value</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.qrCodes?.tracking.enabled}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      qrCodes: {
                        ...prev.qrCodes,
                        tracking: {
                          ...prev.qrCodes?.tracking,
                          enabled: e.target.checked,
                        },
                      },
                    }))}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-700">Signature Lines</label>
                    <p className="text-sm text-gray-500">Include signature spaces</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.signatures?.enabled}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      signatures: {
                        ...prev.signatures,
                        enabled: e.target.checked,
                      },
                    }))}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Generate Certificate
            </button>
          </>
        )}
      </div>

      <div className="sticky top-8" ref={previewRef}>
        <CertificatePreview
          certificate={formData as Certificate}
          templateId={selectedTemplateId}
          overlayColor={overlayColor}
          overlayOpacity={overlayOpacity}
        />
      </div>

      {createdCertificate && (
        <CertificateSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          certificate={createdCertificate}
          onDownload={handleDownload}
          onViewDetails={handleSaveAndClose}
        />
      )}
    </div>
  );
}
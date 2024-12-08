import React from 'react';
import { Certificate } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';

interface CertificatePreviewProps {
  certificate: Certificate;
  templateId: string;
  overlayColor?: string;
  overlayOpacity?: number;
}

export function CertificatePreview({ 
  certificate, 
  templateId,
  overlayColor = '#ffffff',
  overlayOpacity = 0.85
}: CertificatePreviewProps) {
  const textConfig = certificate.textConfig || {};
  const currencySymbol = certificate.currency === 'CUSTOM' 
    ? certificate.customCurrencySymbol 
    : { USD: '$', EUR: '€', GBP: '£' }[certificate.currency] || '$';

  // Get template background
  const getTemplateBackground = () => {
    const templates = {
      'classic': 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?auto=format&fit=crop&q=80&w=1920&h=1080',
      'modern': 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=1920&h=1080',
      'minimal': 'https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?auto=format&fit=crop&q=80&w=1920&h=1080'
    };
    return templates[templateId as keyof typeof templates];
  };

  return (
    <div className="w-[800px] h-[600px] relative overflow-hidden rounded-lg shadow-lg bg-white">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getTemplateBackground()})`,
        }}
      />

      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
        }}
      />

      {/* Content */}
      <div className="relative h-full p-12 flex flex-col">
        {/* Title */}
        {textConfig.title?.enabled && (
          <div
            className={`mb-8 ${
              textConfig.title.textAlign === 'center' ? 'text-center' :
              textConfig.title.textAlign === 'right' ? 'text-right' : 'text-left'
            }`}
            style={{
              fontFamily: textConfig.title.fontFamily,
              fontSize: `${textConfig.title.fontSize}px`,
            }}
          >
            {textConfig.title.customLabel || 'Stock Gift Certificate'}
          </div>
        )}

        {/* Recipient */}
        {textConfig.recipient?.enabled && (
          <div
            className={`mb-4 ${
              textConfig.recipient.textAlign === 'center' ? 'text-center' :
              textConfig.recipient.textAlign === 'right' ? 'text-right' : 'text-left'
            }`}
            style={{
              fontFamily: textConfig.recipient.fontFamily,
              fontSize: `${textConfig.recipient.fontSize}px`,
            }}
          >
            {textConfig.recipient.customLabel} {certificate.recipientName}
          </div>
        )}

        {/* Shares */}
        {textConfig.shares?.enabled && (
          <div
            className={`mb-4 ${
              textConfig.shares.textAlign === 'center' ? 'text-center' :
              textConfig.shares.textAlign === 'right' ? 'text-right' : 'text-left'
            }`}
            style={{
              fontFamily: textConfig.shares.fontFamily,
              fontSize: `${textConfig.shares.fontSize}px`,
            }}
          >
            {textConfig.shares.customLabel} {certificate.shares} {textConfig.shares.customSuffix} {certificate.stockSymbol}
          </div>
        )}

        {/* Sender */}
        {textConfig.sender?.enabled && (
          <div
            className={`mb-8 ${
              textConfig.sender.textAlign === 'center' ? 'text-center' :
              textConfig.sender.textAlign === 'right' ? 'text-right' : 'text-left'
            }`}
            style={{
              fontFamily: textConfig.sender.fontFamily,
              fontSize: `${textConfig.sender.fontSize}px`,
            }}
          >
            {textConfig.sender.customLabel} {certificate.senderName}
          </div>
        )}

        {/* Message */}
        {certificate.message && textConfig.message?.enabled && (
          <div
            className={`mb-8 ${
              textConfig.message.textAlign === 'center' ? 'text-center' :
              textConfig.message.textAlign === 'right' ? 'text-right' : 'text-left'
            } max-w-[600px] mx-auto whitespace-pre-wrap`}
            style={{
              fontFamily: textConfig.message.fontFamily,
              fontSize: `${textConfig.message.fontSize}px`,
            }}
          >
            {certificate.message}
          </div>
        )}

        {/* Dates and Price */}
        {textConfig.dates?.enabled && (
          <div
            className={`mt-auto ${
              textConfig.dates.textAlign === 'center' ? 'text-center' :
              textConfig.dates.textAlign === 'right' ? 'text-right' : 'text-left'
            }`}
            style={{
              fontFamily: textConfig.dates.fontFamily,
              fontSize: `${textConfig.dates.fontSize}px`,
            }}
          >
            <div>{textConfig.dates.priceLabel || 'Purchase Price'}: {currencySymbol}{certificate.purchasePrice}</div>
            <div>{textConfig.dates.purchaseDateLabel || 'Purchase Date'}: {format(new Date(certificate.purchaseDate), 'MMM d, yyyy')}</div>
            <div>{textConfig.dates.redeemDateLabel || 'Redeem Date'}: {format(new Date(certificate.redeemDate), 'MMM d, yyyy')}</div>
          </div>
        )}

        {/* Signatures */}
        {certificate.signatures?.enabled && (
          <div className="grid grid-cols-2 gap-8 pt-8 mt-8 border-t border-gray-300">
            <div className="text-center">
              <div className="h-12 border-b border-gray-400 mb-2"></div>
              <div className="text-sm">{certificate.signatures.senderLabel || "Sender's Signature"}</div>
              {certificate.signatures.sender && (
                <div className="text-xs text-gray-500 mt-1">
                  Signed on {format(new Date(certificate.signatures.timestamp || ''), 'MMM d, yyyy')}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="h-12 border-b border-gray-400 mb-2"></div>
              <div className="text-sm">{certificate.signatures.recipientLabel || "Recipient's Signature"}</div>
              {certificate.signatures.recipient && (
                <div className="text-xs text-gray-500 mt-1">
                  Signed on {format(new Date(certificate.signatures.timestamp || ''), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* QR Codes */}
        <div className="absolute bottom-8 right-8 flex gap-4">
          {certificate.qrCodes?.verification.enabled && certificate.id && (
            <div className="flex flex-col items-center">
              <QRCodeSVG
                value={`${window.location.origin}/verify/${certificate.id}/${certificate.signatures.verificationCode}`}
                size={80}
              />
              <div className="text-xs text-gray-500 mt-2">
                {certificate.qrCodes.verification.label || 'Scan to verify'}
              </div>
            </div>
          )}

          {certificate.qrCodes?.tracking.enabled && certificate.id && (
            <div className="flex flex-col items-center">
              <QRCodeSVG
                value={`${window.location.origin}/track/${certificate.id}`}
                size={80}
              />
              <div className="text-xs text-gray-500 mt-2">
                {certificate.qrCodes.tracking.label || 'Track stock value'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
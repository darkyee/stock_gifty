import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { QRCodeSVG } from 'qrcode.react';
import { Certificate } from '../types';
import { Share2, Download } from 'lucide-react';

interface CertificateEditorProps {
  onSave: (certificate: Certificate) => void;
}

export function CertificateEditor({ onSave }: CertificateEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [formData, setFormData] = useState<Partial<Certificate>>({
    stockSymbol: '',
    shares: 1,
    purchasePrice: 0,
    walletAddress: '',
    recipientName: '',
    senderName: '',
  });

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#f8f9fa',
      });

      // Add certificate border
      const border = new fabric.Rect({
        width: 750,
        height: 550,
        left: 25,
        top: 25,
        fill: 'transparent',
        stroke: '#1a365d',
        strokeWidth: 2,
      });

      fabricCanvas.add(border);

      // Add title
      const title = new fabric.Text('Stock Gift Certificate', {
        left: 400,
        top: 50,
        fontFamily: 'Arial',
        fontSize: 40,
        fontWeight: 'bold',
        fill: '#1a365d',
        originX: 'center',
      });

      fabricCanvas.add(title);
      setCanvas(fabricCanvas);
    }
  }, [canvasRef, canvas]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!canvas) return;

    const certificate: Certificate = {
      id: Date.now().toString(),
      stockSymbol: formData.stockSymbol || '',
      shares: formData.shares || 1,
      purchasePrice: formData.purchasePrice || 0,
      purchaseDate: new Date(),
      walletAddress: formData.walletAddress,
      recipientName: formData.recipientName || '',
      senderName: formData.senderName || '',
    };

    // Generate tracking URL
    const trackingUrl = `${window.location.origin}/track/${certificate.id}`;

    // Add QR code
    const qrCodeContainer = document.createElement('div');
    qrCodeContainer.style.display = 'none';
    document.body.appendChild(qrCodeContainer);
    
    const qrCode = <QRCodeSVG value={trackingUrl} />;
    // Convert QR code to fabric object and add to canvas
    
    onSave(certificate);
  };

  return (
    <div className="flex gap-8 p-8">
      <div className="w-[800px]">
        <canvas ref={canvasRef} />
      </div>
      
      <div className="w-80 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Certificate Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Symbol</label>
          <input
            type="text"
            name="stockSymbol"
            value={formData.stockSymbol}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Shares</label>
          <input
            type="number"
            name="shares"
            value={formData.shares}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
          <input
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Wallet Address (Optional)</label>
          <input
            type="text"
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sender Name</label>
          <input
            type="text"
            name="senderName"
            value={formData.senderName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Share2 className="w-4 h-4" />
            Save & Share
          </button>
          
          <button
            onClick={() => {
              if (canvas) {
                const dataUrl = canvas.toDataURL();
                const link = document.createElement('a');
                link.download = 'stock-certificate.png';
                link.href = dataUrl;
                link.click();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
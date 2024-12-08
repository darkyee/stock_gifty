import React, { useState } from 'react';
import { SimpleEditor } from './components/SimpleEditor';
import { AdvancedEditor } from './components/AdvancedEditor';
import { StockTracker } from './components/StockTracker';
import { GiftList } from './components/gifts/GiftList';
import { Navigation } from './components/Navigation';
import { Certificate } from './types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const [currentPage, setCurrentPage] = useState<'editor' | 'gifts'>('editor');
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const handleSaveCertificate = (certificate: Certificate) => {
    setCertificates((prev) => [...prev, certificate]);
    setSelectedCertificate(certificate);
    setCurrentPage('gifts');
  };

  const handleDeleteGift = (id: string) => {
    setCertificates((prev) => prev.filter(cert => cert.id !== id));
    if (selectedCertificate?.id === id) {
      setSelectedCertificate(null);
    }
  };

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <Navigation
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            if (page === 'editor') {
              setSelectedCertificate(null);
            }
          }}
          editorMode={mode}
          onEditorModeChange={setMode}
        />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {currentPage === 'editor' && !selectedCertificate && (
            mode === 'simple' ? (
              <SimpleEditor onSave={handleSaveCertificate} />
            ) : (
              <AdvancedEditor onSave={handleSaveCertificate} />
            )
          )}

          {currentPage === 'gifts' && !selectedCertificate && (
            <GiftList
              gifts={certificates}
              onDeleteGift={handleDeleteGift}
              onViewDetails={handleViewDetails}
            />
          )}

          {selectedCertificate && (
            <div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back to {currentPage === 'editor' ? 'Editor' : 'Gifts'}
              </button>
              <StockTracker
                certificateId={selectedCertificate.id}
                stockSymbol={selectedCertificate.stockSymbol}
                purchaseDate={new Date(selectedCertificate.purchaseDate)}
                purchasePrice={selectedCertificate.purchasePrice}
                shares={selectedCertificate.shares}
                redeemDate={new Date(selectedCertificate.redeemDate)}
              />
            </div>
          )}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
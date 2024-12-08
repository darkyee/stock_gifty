import React from 'react';
import { Gift, Wand2, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { useCurrency } from '../hooks/useCurrency';

interface NavigationProps {
  currentPage: 'editor' | 'gifts';
  onNavigate: (page: 'editor' | 'gifts') => void;
  editorMode: 'simple' | 'advanced';
  onEditorModeChange: (mode: 'simple' | 'advanced') => void;
}

export function Navigation({ currentPage, onNavigate, editorMode, onEditorModeChange }: NavigationProps) {
  const { t } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="bg-white shadow">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 border-b border-gray-200">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('certificate.title')}
            </h1>
          </div>
          
          <nav className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('editor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                currentPage === 'editor' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('navigation.createCertificate')}
            </button>
            <button
              onClick={() => onNavigate('gifts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                currentPage === 'gifts' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Gift className="w-4 h-4" />
              {t('navigation.myGifts')}
            </button>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <LanguageSelector />
              <CurrencySelector value={currency} onChange={setCurrency} />
            </div>
          </nav>
        </div>
      </div>

      {/* Editor Mode Navigation */}
      {currentPage === 'editor' && (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-end">
            <div className="flex gap-2">
              <button
                onClick={() => onEditorModeChange('simple')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  editorMode === 'simple' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Wand2 className="w-4 h-4" />
                {t('navigation.simpleMode')}
              </button>
              <button
                onClick={() => onEditorModeChange('advanced')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  editorMode === 'advanced' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                {t('navigation.advancedMode')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
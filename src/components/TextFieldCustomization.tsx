import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { TextFieldConfig } from '../types';

interface TextFieldCustomizationProps {
  fieldId: string;
  config: TextFieldConfig;
  defaultLabel: string;
  onChange: (fieldId: string, config: TextFieldConfig) => void;
  isLabelEditable?: boolean;
}

export function TextFieldCustomization({
  fieldId,
  config,
  defaultLabel,
  onChange,
  isLabelEditable = true,
}: TextFieldCustomizationProps) {
  const handleChange = (key: keyof TextFieldConfig, value: any) => {
    onChange(fieldId, { ...config, [key]: value });
  };

  return (
    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="h-4 w-4 text-indigo-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">{defaultLabel}</span>
        </div>
      </div>

      {config.enabled && (
        <div className="space-y-2 mt-2">
          {isLabelEditable && (
            <>
              <input
                type="text"
                value={config.customLabel || ''}
                onChange={(e) => handleChange('customLabel', e.target.value)}
                placeholder="Custom label (e.g., 'This certifies that')"
                className="w-full px-2 py-1 text-sm border rounded"
              />
              {fieldId === 'shares' && (
                <input
                  type="text"
                  value={config.customSuffix || ''}
                  onChange={(e) => handleChange('customSuffix', e.target.value)}
                  placeholder="Custom suffix (e.g., 'share(s) of')"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              )}
              {fieldId === 'dates' && (
                <>
                  <input
                    type="text"
                    value={config.priceLabel || ''}
                    onChange={(e) => handleChange('priceLabel', e.target.value)}
                    placeholder="Price label (e.g., 'Purchase Price')"
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                  <input
                    type="text"
                    value={config.purchaseDateLabel || ''}
                    onChange={(e) => handleChange('purchaseDateLabel', e.target.value)}
                    placeholder="Purchase date label"
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                  <input
                    type="text"
                    value={config.redeemDateLabel || ''}
                    onChange={(e) => handleChange('redeemDateLabel', e.target.value)}
                    placeholder="Redeem date label"
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                </>
              )}
            </>
          )}

          <div className="flex gap-2">
            <select
              value={config.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="flex-1 text-sm border rounded px-2 py-1"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
            </select>

            <input
              type="number"
              value={config.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              min="8"
              max="72"
              className="w-20 text-sm border rounded px-2 py-1"
            />
          </div>

          <div className="flex gap-1 justify-center border rounded p-1 bg-white">
            <button
              onClick={() => handleChange('textAlign', 'left')}
              className={`p-1 rounded ${
                config.textAlign === 'left' ? 'bg-indigo-100' : ''
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleChange('textAlign', 'center')}
              className={`p-1 rounded ${
                config.textAlign === 'center' ? 'bg-indigo-100' : ''
              }`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleChange('textAlign', 'right')}
              className={`p-1 rounded ${
                config.textAlign === 'right' ? 'bg-indigo-100' : ''
              }`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
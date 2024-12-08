import React from 'react';
import { Upload } from 'lucide-react';
import { Template } from '../types';

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  onBackgroundUpload: (file: File) => void;
}

const defaultTemplates: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    backgroundUrl: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?auto=format&fit=crop&q=80&w=1920&h=1080',
    elements: []
  },
  {
    id: 'modern',
    name: 'Modern',
    backgroundUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=1920&h=1080',
    elements: []
  },
  {
    id: 'minimal',
    name: 'Minimal',
    backgroundUrl: 'https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?auto=format&fit=crop&q=80&w=1920&h=1080',
    elements: []
  },
  {
    id: 'custom',
    name: 'Custom Background',
    elements: []
  }
];

export function TemplateSelector({ selectedId, onSelect, onBackgroundUpload }: TemplateSelectorProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          onBackgroundUpload(file);
          onSelect('custom');
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload an image file');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Choose Template</h3>
        <div className="text-sm text-gray-500">
          Recommended size: 1920x1080px
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {defaultTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`relative p-4 border-2 rounded-lg ${
              selectedId === template.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {template.id === 'custom' ? (
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded flex items-center justify-center">
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={template.backgroundUrl}
                  alt={template.name}
                  className="object-cover rounded"
                />
              </div>
            )}
            <span className="block mt-2 text-sm font-medium text-gray-900">
              {template.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
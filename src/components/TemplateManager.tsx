import React from 'react';
import { Template } from '../types';
import { Trash2 } from 'lucide-react';

interface TemplateManagerProps {
  templates: Template[];
  onApply: (template: Template) => void;
}

export function TemplateManager({ templates, onApply }: TemplateManagerProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Saved Templates</h3>
      
      {templates.length === 0 ? (
        <p className="text-sm text-gray-500">No templates saved yet</p>
      ) : (
        <div className="space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
            >
              <span className="text-sm font-medium text-gray-900">{template.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onApply(template)}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Apply
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
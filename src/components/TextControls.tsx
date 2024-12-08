import React from 'react';
import { fabric } from 'fabric';

interface TextControlsProps {
  object: fabric.Object;
  onChange: () => void;
}

export function TextControls({ object, onChange }: TextControlsProps) {
  if (!(object instanceof fabric.IText)) return null;

  const handleChange = (property: string, value: any) => {
    (object as any)[property] = value;
    onChange();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Text Properties</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Font Size</label>
        <input
          type="number"
          value={object.fontSize}
          onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Font Family</label>
        <select
          value={object.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Text Align</label>
        <select
          value={object.textAlign}
          onChange={(e) => handleChange('textAlign', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <input
          type="color"
          value={object.fill?.toString()}
          onChange={(e) => handleChange('fill', e.target.value)}
          className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
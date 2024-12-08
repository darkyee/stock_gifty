import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Certificate, Template } from '../types';
import { TextControls } from './TextControls';
import { ImageUploader } from './ImageUploader';
import { TemplateManager } from './TemplateManager';
import { Save, Download, Image as ImageIcon, Type as TypeIcon } from 'lucide-react';

interface AdvancedEditorProps {
  onSave: (certificate: Certificate) => void;
}

export function AdvancedEditor({ onSave }: AdvancedEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
      });

      fabricCanvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0] || null));
      fabricCanvas.on('selection:cleared', () => setSelectedObject(null));

      setCanvas(fabricCanvas);
    }
  }, [canvasRef, canvas]);

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Edit text', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const handleImageUpload = (url: string) => {
    if (!canvas) return;
    fabric.Image.fromURL(url, (img) => {
      img.scaleToWidth(200);
      canvas.add(img);
      canvas.setActiveObject(img);
    });
  };

  const saveTemplate = () => {
    if (!canvas) return;
    const template: Template = {
      id: Date.now().toString(),
      name: `Template ${templates.length + 1}`,
      elements: canvas.getObjects().map(obj => ({
        type: obj.type as 'text' | 'image',
        x: obj.left || 0,
        y: obj.top || 0,
        width: obj.width || undefined,
        height: obj.height || undefined,
        text: (obj as fabric.IText).text || undefined,
        fontSize: (obj as fabric.IText).fontSize || undefined,
        fontFamily: (obj as fabric.IText).fontFamily || undefined,
        textAlign: (obj as fabric.IText).textAlign || undefined,
        fill: obj.fill?.toString() || undefined,
      })),
    };
    setTemplates([...templates, template]);
  };

  return (
    <div className="flex gap-8 p-8">
      <div className="w-[800px]">
        <canvas ref={canvasRef} />
        <div className="mt-4 flex gap-4">
          <button
            onClick={addText}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <TypeIcon className="w-4 h-4" />
            Add Text
          </button>
          <ImageUploader onUpload={handleImageUpload}>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              <ImageIcon className="w-4 h-4" />
              Add Image
            </button>
          </ImageUploader>
          <button
            onClick={saveTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Save className="w-4 h-4" />
            Save as Template
          </button>
        </div>
      </div>

      <div className="w-80 space-y-6">
        {selectedObject && (
          <TextControls
            object={selectedObject}
            onChange={() => canvas?.renderAll()}
          />
        )}
        
        <TemplateManager
          templates={templates}
          onApply={(template) => {
            if (!canvas) return;
            canvas.clear();
            template.elements.forEach(elem => {
              if (elem.type === 'text') {
                const text = new fabric.IText(elem.text || '', {
                  left: elem.x,
                  top: elem.y,
                  fontFamily: elem.fontFamily,
                  fontSize: elem.fontSize,
                  fill: elem.fill,
                  textAlign: elem.textAlign,
                });
                canvas.add(text);
              }
            });
            canvas.renderAll();
          }}
        />
      </div>
    </div>
  );
}
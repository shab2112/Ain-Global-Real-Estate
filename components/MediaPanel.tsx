
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface MediaPanelProps {
  originalImage: string | null;
  setOriginalImage: (image: string | null) => void;
  enhancedImage: string | null;
  onEnhance: (prompt: string) => void;
  isLoading: boolean;
  setEnhancedImage: (image: string | null) => void;
}

const enhancementOptions = [
  {
    label: 'Improve Lighting',
    prompt:
      'Significantly improve the lighting and color balance of this real estate photo. Make it look bright, airy, and luxurious, as if shot by a professional photographer during the golden hour.',
  },
  {
    label: 'Virtual Staging',
    prompt:
      'This is an empty room in a luxury property. Add modern, minimalist virtual staging furniture to make it look appealing to high-net-worth individuals. Include a sofa, a coffee table, a rug, and some art on the wall.',
  },
  {
    label: 'Change Sky',
    prompt:
      'Replace the sky in this exterior property photo with a beautiful, dramatic sunset sky. Ensure the lighting on the building is adjusted to match the new sky realistically.',
  },
];

const MediaPanel: React.FC<MediaPanelProps> = ({
  originalImage,
  setOriginalImage,
  enhancedImage,
  onEnhance,
  isLoading,
  setEnhancedImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEnhancedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-brand-secondary p-6 rounded-xl shadow-lg flex flex-col gap-4 h-full">
      <h3 className="text-lg font-semibold text-brand-text">4. Upload & Enhance Media</h3>
      <div
        className="relative w-full aspect-video bg-brand-primary border-2 border-dashed border-brand-accent rounded-lg flex items-center justify-center text-brand-light cursor-pointer hover:border-brand-gold transition-colors"
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {originalImage ? (
          <img
            src={originalImage}
            alt="Uploaded"
            className="object-contain w-full h-full rounded-md"
          />
        ) : (
          <div className="text-center">
            <UploadIcon className="w-10 h-10 mx-auto mb-2" />
            <p>Click to upload an image</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>

      {originalImage && (
        <>
          <h4 className="text-md font-semibold text-brand-light">AI Enhancements</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {enhancementOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => onEnhance(opt.prompt)}
                disabled={isLoading}
                className="bg-brand-accent text-brand-text text-sm py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-brand-light hover:text-brand-primary transition-colors disabled:bg-brand-accent/50 disabled:cursor-not-allowed"
              >
                <SparklesIcon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>
          <div className="relative w-full aspect-video bg-brand-primary border-2 border-brand-accent rounded-lg flex items-center justify-center text-brand-light mt-4">
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 rounded-md">
                <div className="w-8 h-8 border-4 border-t-transparent border-brand-gold rounded-full animate-spin"></div>
                <p className="mt-2 text-brand-text">Enhancing...</p>
              </div>
            )}
            {enhancedImage ? (
              <img
                src={enhancedImage}
                alt="Enhanced"
                className="object-contain w-full h-full rounded-md"
              />
            ) : (
              <div className="text-center">
                <p>Enhanced image will appear here</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MediaPanel;

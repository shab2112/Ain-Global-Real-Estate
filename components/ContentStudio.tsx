
import React, { useState, useCallback } from 'react';
import PromptPanel from './PromptPanel';
import MediaPanel from './MediaPanel';
import PreviewPanel from './PreviewPanel';
import { SocialPlatform } from '../types';
import { generateText, enhanceImage } from '../services/geminiService';

const ContentStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('Masaar 3, luxury villas, Indian investors, family focus');
  const [platform, setPlatform] = useState<SocialPlatform>(SocialPlatform.Facebook);
  const [postText, setPostText] = useState('');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoadingText(true);
    setError(null);
    try {
      const generated = await generateText(prompt, platform);
      setPostText(generated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoadingText(false);
    }
  }, [prompt, platform]);

  const handleImageEnhance = useCallback(async (enhancementPrompt: string) => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoadingImage(true);
    setError(null);
    setEnhancedImage(null);
    try {
      const enhanced = await enhanceImage(originalImage, enhancementPrompt);
      setEnhancedImage(enhanced);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoadingImage(false);
    }
  }, [originalImage]);

  return (
    <div className="h-full flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-brand-text mb-4">AI Content Studio</h2>
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <PromptPanel
          prompt={prompt}
          setPrompt={setPrompt}
          platform={platform}
          setPlatform={setPlatform}
          postText={postText}
          setPostText={setPostText}
          onGenerate={handleTextGenerate}
          isLoading={isLoadingText}
        />
        <MediaPanel
          originalImage={originalImage}
          setOriginalImage={setOriginalImage}
          enhancedImage={enhancedImage}
          onEnhance={handleImageEnhance}
          isLoading={isLoadingImage}
          setEnhancedImage={setEnhancedImage}
        />
        <PreviewPanel
          platform={platform}
          text={postText}
          image={enhancedImage || originalImage}
        />
      </div>
    </div>
  );
};

export default ContentStudio;

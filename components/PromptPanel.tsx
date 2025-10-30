
import React from 'react';
import { SocialPlatform } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';

interface PromptPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  platform: SocialPlatform;
  setPlatform: (platform: SocialPlatform) => void;
  postText: string;
  setPostText: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const platformOptions = [
  { id: SocialPlatform.Facebook, icon: FacebookIcon, label: 'Facebook' },
  { id: SocialPlatform.LinkedIn, icon: LinkedInIcon, label: 'LinkedIn' },
  { id: SocialPlatform.YouTube, icon: YouTubeIcon, label: 'YouTube' },
];

const PromptPanel: React.FC<PromptPanelProps> = ({
  prompt,
  setPrompt,
  platform,
  setPlatform,
  postText,
  setPostText,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-xl shadow-lg flex flex-col gap-6 h-full">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-brand-light mb-2">
          1. Enter Keywords or a Topic
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Downtown Dubai, luxury penthouse, panoramic views"
          className="w-full bg-brand-primary border border-brand-accent rounded-md p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition text-brand-text"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-light mb-2">
          2. Select Target Platform
        </label>
        <div className="grid grid-cols-3 gap-2">
          {platformOptions.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setPlatform(id)}
              className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all duration-200 ${
                platform === id
                  ? 'bg-brand-gold/20 border-brand-gold text-brand-gold'
                  : 'bg-brand-primary border-brand-accent hover:border-brand-light'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full bg-brand-gold text-brand-primary font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:bg-brand-accent disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-t-transparent border-brand-primary rounded-full animate-spin"></div>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            Generate Post Copy
          </>
        )}
      </button>

      <div className="flex-1 flex flex-col">
        <label htmlFor="postText" className="block text-sm font-medium text-brand-light mb-2">
          3. Edit & Refine Generated Copy
        </label>
        <textarea
          id="postText"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="AI generated content will appear here..."
          className="w-full flex-1 bg-brand-primary border border-brand-accent rounded-md p-3 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition text-brand-text"
        />
      </div>
    </div>
  );
};

export default PromptPanel;

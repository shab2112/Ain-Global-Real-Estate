import React from 'react';
import { SocialPlatform } from '../types';
import { FacebookIcon } from './icons/FacebookIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';

interface PreviewPanelProps {
  platform: SocialPlatform;
  text: string;
  image: string | null;
}

const PlatformHeader: React.FC<{ platform: SocialPlatform }> = ({ platform }) => {
    const platformDetails = {
      [SocialPlatform.Facebook]: { Icon: FacebookIcon, name: 'Facebook Preview', color: 'text-blue-500' },
      [SocialPlatform.LinkedIn]: { Icon: LinkedInIcon, name: 'LinkedIn Preview', color: 'text-blue-400' },
      [SocialPlatform.YouTube]: { Icon: YouTubeIcon, name: 'YouTube Preview', color: 'text-red-500' },
    };
  
    const { Icon, name, color } = platformDetails[platform];
  
    return (
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-6 h-6 ${color}`} />
        <h3 className="text-lg font-semibold text-brand-text">{name}</h3>
      </div>
    );
};

const PreviewPanel: React.FC<PreviewPanelProps> = ({ platform, text, image }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-xl shadow-lg h-full flex flex-col">
      <PlatformHeader platform={platform} />
      <div className="flex-1 bg-brand-primary rounded-lg p-4 overflow-y-auto border border-brand-accent">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center font-bold text-brand-primary">
            LP
          </div>
          <div>
            <p className="font-bold text-brand-text">Lucra Pro</p>
            <p className="text-xs text-brand-light">Just now</p>
          </div>
        </div>
        <p className="text-brand-text whitespace-pre-wrap text-sm mb-4">
          {text || "Your generated text will appear here..."}
        </p>
        {image && (
          <div className="w-full aspect-video bg-brand-secondary rounded-md overflow-hidden">
            <img src={image} alt="Post preview" className="w-full h-full object-cover" />
          </div>
        )}
        {!image && (
             <div className="w-full aspect-video bg-brand-secondary rounded-md flex items-center justify-center text-brand-light">
                Your image will appear here
             </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
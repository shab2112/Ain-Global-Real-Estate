
import React from 'react';
import { SocialPlatform, User } from '../types';
import { FacebookIcon } from './icons/FacebookIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { mockUsers } from '../data/mockData';

interface PreviewPanelProps {
  platform: SocialPlatform;
  postText: string;
  image: string | null;
  currentUser: User;
}

const platformIcons = {
  [SocialPlatform.Facebook]: FacebookIcon,
  [SocialPlatform.LinkedIn]: LinkedInIcon,
  [SocialPlatform.YouTube]: YouTubeIcon,
  [SocialPlatform.Instagram]: FacebookIcon, // Placeholder
  [SocialPlatform.Twitter]: FacebookIcon, // Placeholder
};

const PreviewPanel: React.FC<PreviewPanelProps> = ({ platform, postText, image, currentUser }) => {
  const PlatformIcon = platformIcons[platform];
  const user = mockUsers.find(u => u.role === 'Owner') || currentUser; // mock agency profile

  return (
    <div className="bg-brand-secondary p-6 rounded-xl shadow-lg flex flex-col gap-4 h-full">
      <h3 className="text-lg font-semibold text-brand-text">5. Live Preview</h3>
      <div className="flex-1 bg-brand-primary border border-brand-accent rounded-lg p-4 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-primary flex items-center justify-center font-bold">
              {user.avatar}
            </div>
            <div>
              <p className="font-bold text-sm text-brand-text">{user.name} Properties</p>
              <p className="text-xs text-brand-light flex items-center gap-1">
                Sponsored <span className="font-bold">·</span> <PlatformIcon className="w-3 h-3"/>
              </p>
            </div>
          </div>

          {/* Post Text */}
          {postText && (
            <div className="text-brand-light text-sm whitespace-pre-wrap mb-3">
              {postText.split('\n').map((line, i) => (
                <p key={i}>{line || '\u00A0'}</p> // Render empty lines for spacing
              ))}
            </div>
          )}

          {/* Image */}
          {image ? (
            <div className="aspect-video bg-brand-secondary rounded-md overflow-hidden">
              <img src={image} alt="Post preview" className="w-full h-full object-cover" />
            </div>
          ) : (
             <div className="aspect-video bg-brand-secondary rounded-md flex items-center justify-center text-brand-light/50">
                <p>Image will appear here</p>
             </div>
          )}

          {/* Footer/Actions */}
          <div className="mt-3 pt-2 border-t border-brand-accent flex justify-around text-sm font-semibold text-brand-light">
             <button className="flex-1 p-2 rounded-md hover:bg-brand-secondary">Like</button>
             <button className="flex-1 p-2 rounded-md hover:bg-brand-secondary">Comment</button>
             <button className="flex-1 p-2 rounded-md hover:bg-brand-secondary">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;

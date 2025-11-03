import React from 'react';
import { SocialPlatform } from '../types';
import { brandingConfig } from '../data/branding';
import { FacebookIcon } from './icons/FacebookIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { InstagramIcon } from './icons/InstagramIcon'; // Assuming you'll create this

interface BrandOverlayPreviewProps {
  imageSrc: string;
  projectName: string;
  platform: SocialPlatform;
}

const platformIcons = {
    [SocialPlatform.Facebook]: FacebookIcon,
    [SocialPlatform.LinkedIn]: LinkedInIcon,
    [SocialPlatform.Instagram]: InstagramIcon,
    // Add others if needed
};

const BrandOverlayPreview: React.FC<BrandOverlayPreviewProps> = ({ 
  imageSrc, 
  projectName,
  platform,
}) => {
  const PlatformIcon = platformIcons[platform] || FacebookIcon;

  return (
    <div style={{
      fontFamily: brandingConfig.font,
      position: 'relative',
      width: '100%',
      aspectRatio: '1 / 1', // Square for social media
      backgroundColor: '#161B22',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #30363D'
    }}>
        {/* Mock Header */}
        <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={brandingConfig.logoUrl} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}/>
            <div>
                <p style={{ fontWeight: 600, fontSize: '14px', color: brandingConfig.colors.text }}>{brandingConfig.brandName}</p>
                <p style={{ fontSize: '12px', color: brandingConfig.colors.light }}>Sponsored</p>
            </div>
        </div>

        {/* Main Image with Overlay */}
        <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            backgroundColor: '#0D1117'
        }}>
            <img 
                src={imageSrc} 
                alt={`${projectName} preview`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            {/* Gradient Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to top, rgba(13, 17, 23, ${brandingConfig.colors.overlayOpacity}) 20%, transparent 80%)`,
            }}/>
            {/* Logo Watermark */}
             <img 
                src={brandingConfig.logoUrl}
                alt="Watermark"
                style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    width: '48px',
                    height: '48px',
                    opacity: 0.8,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))',
                    objectFit: 'cover'
                }}
            />
        </div>

        {/* Mock Footer */}
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                    backgroundColor: brandingConfig.ctaStyle.backgroundColor,
                    color: brandingConfig.ctaStyle.textColor,
                    padding: '8px 16px',
                    borderRadius: brandingConfig.ctaStyle.shape === 'rounded' ? '8px' : '99px',
                    fontSize: '14px',
                    fontWeight: 600,
                    textAlign: 'center'
                }}>
                    {brandingConfig.ctaStyle.text}
                </div>
                <PlatformIcon style={{ width: '24px', height: '24px', color: brandingConfig.colors.light }} />
            </div>
            <p style={{ fontSize: '10px', color: brandingConfig.colors.light, opacity: 0.7 }}>
                {brandingConfig.disclaimer}
            </p>
        </div>
    </div>
  );
};

export default BrandOverlayPreview;
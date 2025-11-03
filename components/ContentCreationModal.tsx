import React, { useState, useEffect, useRef } from 'react';
import { ContentPost, DriveProject, PostStatus, SocialPlatform, User, PostType, DriveAsset } from '../types';
import { createContentPost, updateContentPost } from '../services/apiService';
import { generatePostCopy, enhanceImage, generateVideoWithHeyGen } from '../services/geminiService';
import { masterPrompts } from '../data/masterPrompts';
import { SparklesIcon } from './icons/SparklesIcon';
import { ImageIcon } from './icons/ImageIcon';
import { VideoIcon } from './icons/VideoIcon';
import BrandOverlayPreview from './BrandOverlayPreview';
import { UploadIcon } from './icons/UploadIcon';
import { brandingConfig } from '../data/branding';
import { FacebookIcon } from './icons/FacebookIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';


type ModalStep = 'POST_TYPE_SELECTION' | 'ASSET_SELECTION' | 'CONTENT_GENERATION';

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
  
interface ContentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  project: DriveProject;
  currentUser: User;
  selectedDate: Date;
  post: ContentPost | null;
}

const platformIcons = {
    [SocialPlatform.Facebook]: FacebookIcon,
    [SocialPlatform.LinkedIn]: LinkedInIcon,
    [SocialPlatform.Instagram]: InstagramIcon,
    [SocialPlatform.YouTube]: YouTubeIcon,
    [SocialPlatform.Twitter]: FacebookIcon, // Placeholder
};

const ContentCreationModal: React.FC<ContentCreationModalProps> = ({ isOpen, onClose, onSave, project, currentUser, selectedDate, post }) => {
  const [step, setStep] = useState<ModalStep>('POST_TYPE_SELECTION');
  const [postType, setPostType] = useState<PostType | null>(null);
  const [platform, setPlatform] = useState<SocialPlatform>(SocialPlatform.Facebook);
  const [postText, setPostText] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<DriveAsset | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');

  const [heygenApiKey, setHeygenApiKey] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep('POST_TYPE_SELECTION');
    setPostType(null);
    setPlatform(SocialPlatform.Facebook);
    setPostText('');
    setSelectedAsset(null);
    setKeywords('');
    setIsGenerating(false);
    setGenerationStatus('');
    setGeneratedVideoUrl(null);

    const initialDate = post ? new Date(post.scheduledDate) : new Date(selectedDate);
    initialDate.setHours(10,0);
    const localISOString = new Date(initialDate.getTime() - (initialDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    setScheduledDate(localISOString);

    if (post) {
        setPostType(post.postType);
        setPlatform(post.platform);
        setPostText(post.postText);
        const assetUrl = post.imageUrl || post.videoUrl;
        const existingAsset = project.assets.find(a => a.url === assetUrl);
        if (existingAsset) {
            setSelectedAsset(existingAsset);
        } else if (assetUrl) {
            setSelectedAsset({ id: 'existing-asset', name: 'Previously Used Asset', url: assetUrl, type: post.postType === PostType.Image ? 'image' : 'video' });
        }
        setStep('CONTENT_GENERATION');
    }
  };

  useEffect(() => {
    if (isOpen) {
        resetState();
    }
  }, [isOpen, post, selectedDate, project]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const newAsset: DriveAsset = {
            id: `upload-${Date.now()}`,
            name: file.name,
            url: dataUrl,
            type: postType === PostType.Image ? 'image' : 'video'
        };
        setSelectedAsset(newAsset);
        setStep('CONTENT_GENERATION');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateCopy = async () => {
    const factsheet = project.assets.find(a => a.type === 'factsheet')?.content || 'No factsheet available.';
    if (!keywords || !postType) return;
    setIsGenerating(true);
    setGenerationStatus('Generating post copy...');
    try {
        const masterPrompt = masterPrompts[postType];
        const generatedText = await generatePostCopy(masterPrompt, keywords, factsheet, platform, selectedAsset?.name);
        setPostText(generatedText);
    } catch (error) {
        setGenerationStatus(error instanceof Error ? error.message : 'Failed to generate copy.');
    } finally {
        setIsGenerating(false);
        setGenerationStatus('');
    }
  };
  
  const handleEnhanceImage = async () => {
    if(!selectedAsset || !keywords) return;
    setIsGenerating(true);
    setGenerationStatus('Enhancing image...');
    try {
        const enhancedImageUrl = await enhanceImage(selectedAsset.url, keywords);
        const newAsset = { ...selectedAsset, url: enhancedImageUrl, id: `enhanced-${Date.now()}` };
        setSelectedAsset(newAsset);
        setGenerationStatus('Image enhanced successfully!');
    } catch (error) {
        setGenerationStatus(error instanceof Error ? error.message : 'Failed to enhance image.');
    } finally {
        setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!keywords) return;
    setIsGenerating(true);
    setGenerationStatus('Initializing video generation with HeyGen...');
    try {
        const masterPrompt = masterPrompts[PostType.Video];
        const fullPrompt = `${masterPrompt}\n\nUser Keywords: ${keywords}`;
        const videoUrl = await generateVideoWithHeyGen(fullPrompt, heygenApiKey, selectedAsset?.url);
        setGeneratedVideoUrl(videoUrl);
        setGenerationStatus('Video generated successfully!');
    } catch (error) {
        setGenerationStatus(error instanceof Error ? error.message : 'Failed to generate video.');
    } finally {
        setIsGenerating(false);
    }
  };


  const handleSubmit = async (status: PostStatus) => {
    if (!postType) return;
    const postData = {
      projectId: project.id,
      platform,
      postType: postType,
      status,
      scheduledDate: new Date(scheduledDate).toISOString(),
      createdBy: post?.createdBy || currentUser.id,
      postText,
      imageUrl: postType === PostType.Image ? selectedAsset?.url : undefined,
      videoUrl: postType === PostType.Video ? (generatedVideoUrl || selectedAsset?.url) : undefined,
    };

    try {
      if (post) {
        await updateContentPost(post.id, { ...postData, approvedBy: post.approvedBy });
      } else {
        await createContentPost(postData);
      }
      onSave();
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 'POST_TYPE_SELECTION':
        return (
          <div className="p-8 flex flex-col items-center justify-center gap-8">
            <h3 className="text-2xl font-bold text-brand-text">What type of content do you want to create?</h3>
            <div className="flex gap-8">
              <button onClick={() => { setPostType(PostType.Image); setStep('ASSET_SELECTION'); }} className="flex flex-col items-center gap-4 p-8 bg-brand-primary rounded-xl border-2 border-brand-accent hover:border-brand-gold transition-colors">
                <ImageIcon className="w-16 h-16 text-brand-gold" />
                <span className="text-xl font-semibold text-brand-text">Image Post</span>
              </button>
              <button onClick={() => { setPostType(PostType.Video); setStep('ASSET_SELECTION'); }} className="flex flex-col items-center gap-4 p-8 bg-brand-primary rounded-xl border-2 border-brand-accent hover:border-brand-gold transition-colors">
                <VideoIcon className="w-16 h-16 text-brand-gold" />
                <span className="text-xl font-semibold text-brand-text">Video Post</span>
              </button>
            </div>
          </div>
        );

      case 'ASSET_SELECTION':
        const assets = project.assets.filter(a => a.type === (postType === PostType.Image ? 'image' : 'video'));
        return (
          <div className="p-6 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-brand-text">Select a visual asset for your post</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 overflow-y-auto max-h-96">
                <button onClick={() => fileInputRef.current?.click()} className="aspect-square bg-brand-primary rounded-lg flex flex-col items-center justify-center text-brand-light border-2 border-dashed border-brand-accent hover:border-brand-gold transition-colors">
                    <UploadIcon className="w-10 h-10 mb-2"/>
                    <span className="text-sm font-semibold">Upload {postType}</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept={postType === PostType.Image ? 'image/*' : 'video/*'} />

              {assets.map(asset => (
                <button key={asset.id} onClick={() => { setSelectedAsset(asset); setStep('CONTENT_GENERATION'); }} className="relative aspect-square rounded-lg overflow-hidden ring-2 ring-transparent hover:ring-brand-gold transition-all group">
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-xs truncate">{asset.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'CONTENT_GENERATION':
        const PlatformIcon = platformIcons[platform];
        return (
          <>
            <main className="p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Controls */}
                <div className="flex flex-col gap-4">
                    <div className="bg-brand-primary p-4 rounded-lg border border-brand-accent">
                        <h4 className="font-bold text-brand-gold text-sm mb-2">MASTER PROMPT</h4>
                        <pre className="text-xs text-brand-light whitespace-pre-wrap font-sans max-h-24 overflow-y-auto">{masterPrompts[postType!]}</pre>
                    </div>
                    <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-brand-light mb-1">Keywords / Focus</label>
                        <textarea id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g., family amenities, panoramic sea views, limited time offer" className="w-full bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold text-brand-text" rows={2}/>
                    </div>

                    {postType === PostType.Image && (
                        <button onClick={handleEnhanceImage} disabled={isGenerating || !selectedAsset} className="w-full bg-brand-accent text-brand-text font-semibold py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-brand-light hover:text-brand-primary disabled:opacity-50">
                            {isGenerating && generationStatus.includes('Enhancing') ? <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div> : <SparklesIcon className="w-4 h-4" />}
                            Enhance Image with AI
                        </button>
                    )}
                    
                    {postType === PostType.Video && (
                         <div className="bg-brand-primary p-3 rounded-lg border border-brand-accent">
                            <label htmlFor="heygen-key" className="block text-sm font-medium text-brand-light mb-1">HeyGen API Key</label>
                            <input type="password" id="heygen-key" value={heygenApiKey} onChange={e => setHeygenApiKey(e.target.value)} placeholder="Enter your HeyGen API key..." className="w-full bg-brand-secondary border border-brand-accent rounded-md p-2 text-brand-text"/>
                            <button onClick={handleGenerateVideo} disabled={isGenerating || !heygenApiKey} className="w-full mt-2 bg-brand-gold text-brand-primary font-bold py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-yellow-400 disabled:bg-brand-accent disabled:cursor-not-allowed">
                                {isGenerating && generationStatus.includes('video') ? <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div> : <VideoIcon className="w-4 h-4" />}
                                Generate Video
                            </button>
                        </div>
                    )}
                    
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="postText" className="block text-sm font-medium text-brand-light mb-1">Post Copy</label>
                        <textarea id="postText" value={postText} onChange={e => setPostText(e.target.value)} placeholder="AI generated content will appear here..." className="w-full flex-1 bg-brand-primary border border-brand-accent rounded-md p-3 focus:ring-2 focus:ring-brand-gold text-brand-text resize-none" rows={6}/>
                        <button onClick={handleGenerateCopy} disabled={isGenerating} className="w-full mt-2 bg-brand-gold/20 text-brand-gold text-sm font-semibold py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-brand-gold/40 disabled:opacity-50">
                            {isGenerating && generationStatus.includes('copy') ? <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div> : <SparklesIcon className="w-4 h-4" />}
                            Generate Copy
                        </button>
                    </div>
                </div>
                {/* Right Column: Preview */}
                <div className="flex flex-col gap-4">
                    {generationStatus && <div className="text-center text-sm text-brand-light p-2 bg-brand-primary rounded-md">{generationStatus}</div>}
                    
                    <div className="bg-brand-primary border border-brand-accent rounded-lg p-4 w-full max-w-md mx-auto">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                            <img src={brandingConfig.logoUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-bold text-sm text-brand-text">{brandingConfig.brandName}</p>
                                <p className="text-xs text-brand-light flex items-center gap-1">
                                    Sponsored · <PlatformIcon className="w-3 h-3"/>
                                </p>
                            </div>
                        </div>
                        {/* Post Text */}
                        {postText && (
                            <div className="text-brand-light text-sm whitespace-pre-wrap mb-3">
                                {postText.split('\n').map((line, i) => (
                                    <p key={i}>{line || '\u00A0'}</p>
                                ))}
                            </div>
                        )}
                        {/* Media */}
                        {postType === PostType.Image && selectedAsset && (
                            <BrandOverlayPreview imageSrc={selectedAsset.url} projectName={project.name} platform={platform} />
                        )}
                        {postType === PostType.Video && (
                            <div className="w-full aspect-video bg-brand-secondary rounded-lg flex items-center justify-center text-brand-light border border-brand-accent">
                                {generatedVideoUrl ? (
                                    <video src={generatedVideoUrl} controls className="w-full h-full rounded-lg" />
                                ) : selectedAsset ? (
                                    <div className="text-center p-4">
                                        <p className="font-semibold">Input Video:</p>
                                        <img src={selectedAsset.url} alt={selectedAsset.name} className="w-full h-auto object-contain rounded-md my-2 max-h-24"/>
                                        <p className="mt-4 text-xs opacity-70">Generated video will appear here.</p>
                                    </div>
                                ) : <p>No video selected.</p>}
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
            </main>
            <footer className="p-4 border-t border-brand-accent flex justify-end items-center gap-3 flex-shrink-0">
                <button onClick={() => handleSubmit(PostStatus.Draft)} className="bg-brand-accent text-brand-text font-semibold py-2 px-4 rounded-lg hover:bg-brand-light hover:text-brand-primary transition-colors">Save Draft</button>
                <button onClick={() => handleSubmit(PostStatus.PendingApproval)} className={`bg-brand-gold text-brand-primary font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors`}>Submit for Approval to {platform}</button>
            </footer>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-secondary rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-brand-accent flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-brand-text">{post ? 'Edit' : 'Create'} Content for {project.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-accent transition-colors">
            <XIcon className="w-6 h-6 text-brand-light" />
          </button>
        </header>
        {renderStep()}
      </div>
    </div>
  );
};

export default ContentCreationModal;

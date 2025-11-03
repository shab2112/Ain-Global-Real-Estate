import React, { useState, useEffect, useCallback } from 'react';
import { DriveProject, User, SocialPlatform, PostStatus, ContentPost, DriveAsset } from '../types';
import { generateText } from '../services/geminiService';
import { createContentPost, updateContentPost } from '../services/apiService';
import { FacebookIcon } from './icons/FacebookIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ContentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  project: DriveProject;
  currentUser: User;
  selectedDate: Date;
  post: ContentPost | null;
}

const platformOptions = [
    { id: SocialPlatform.Facebook, icon: FacebookIcon, label: 'Facebook' },
    { id: SocialPlatform.LinkedIn, icon: LinkedInIcon, label: 'LinkedIn' },
    { id: SocialPlatform.YouTube, icon: YouTubeIcon, label: 'YouTube' },
];

const ContentCreationModal: React.FC<ContentCreationModalProps> = ({
  isOpen, onClose, onSave, project, currentUser, selectedDate, post
}) => {
  const [platform, setPlatform] = useState<SocialPlatform>(post?.platform || SocialPlatform.Facebook);
  const [prompt, setPrompt] = useState('');
  const [postText, setPostText] = useState(post?.postText || '');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(post?.imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const factsheet = project.assets.find(a => a.type === 'factsheet');
  const projectImages = project.assets.filter(a => a.type === 'image');

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    try {
      const generated = await generateText(prompt, platform, factsheet?.content);
      setPostText(generated);
    } catch (error) {
      console.error(error);
      alert("Failed to generate text.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, platform, factsheet]);

  const handleSave = async (status: PostStatus) => {
    setIsSaving(true);
    const postData = {
        projectId: project.id,
        platform,
        status,
        scheduledDate: selectedDate.toISOString(),
        createdBy: post?.createdBy || currentUser.id,
        postText,
        imageUrl: selectedImage,
    };
    try {
        if (post) {
            await updateContentPost(post.id, postData);
        } else {
            await createContentPost(postData);
        }
        onSave();
    } catch (error) {
        console.error("Failed to save post:", error);
        alert("Failed to save post.");
    } finally {
        setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-brand-secondary rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-text">
            {post ? 'Edit' : 'Schedule'} Post for {new Intl.DateTimeFormat().format(selectedDate)}
          </h2>
          <button onClick={onClose} className="text-brand-light hover:text-brand-text">&times;</button>
        </div>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pr-2">
            {/* Left Panel: Creation */}
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-brand-light mb-2">Platform</label>
                    <div className="grid grid-cols-3 gap-2">
                        {platformOptions.map(({ id, icon: Icon, label }) => (
                            <button key={id} onClick={() => setPlatform(id)} className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${platform === id ? 'bg-brand-gold/20 border-brand-gold' : 'border-brand-accent hover:border-brand-light'}`}>
                            <Icon className="w-5 h-5" /> <span className="text-sm">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-brand-light mb-2">
                        Content Prompt (Keywords)
                    </label>
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., focus on family amenities" className="w-full bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold" rows={2}/>
                    <button onClick={handleGenerate} disabled={isLoading} className="mt-2 w-full bg-brand-gold/80 text-brand-primary font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors disabled:opacity-50">
                        {isLoading ? 'Generating...' : <><SparklesIcon className="w-5 h-5"/>Generate Copy</>}
                    </button>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-brand-light mb-2">
                        Post Copy
                    </label>
                    <textarea value={postText} onChange={e => setPostText(e.target.value)} className="w-full h-48 bg-brand-primary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold" />
                </div>
            </div>

            {/* Right Panel: Assets & Preview */}
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-brand-light mb-2">Select Image</label>
                    <div className="grid grid-cols-3 gap-2 bg-brand-primary p-2 rounded-lg h-48 overflow-y-auto">
                        {projectImages.map(img => (
                            <button key={img.id} onClick={() => setSelectedImage(img.url)} className={`relative rounded-md overflow-hidden ring-2 ${selectedImage === img.url ? 'ring-brand-gold' : 'ring-transparent hover:ring-brand-light'}`}>
                                <img src={img.url} alt={img.name} className="w-full h-full object-cover"/>
                                {selectedImage === img.url && <div className="absolute inset-0 bg-black/50"/>}
                            </button>
                        ))}
                    </div>
                </div>
                 {/* Preview Panel */}
                <div className="flex-1 flex flex-col min-h-0">
                    <label className="block text-sm font-medium text-brand-light mb-2">Live Preview</label>
                    <div className="flex-1 bg-brand-primary rounded-lg p-3 border border-brand-accent overflow-y-auto">
                        <p className="text-brand-text whitespace-pre-wrap text-sm mb-2">{postText || "Your generated text will appear here..."}</p>
                        {selectedImage && <img src={selectedImage} alt="preview" className="w-full rounded-md object-cover"/>}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button onClick={() => handleSave(PostStatus.Draft)} disabled={isSaving} className="bg-brand-accent text-brand-text font-semibold py-2 px-4 rounded-lg hover:bg-brand-light hover:text-brand-primary transition-colors disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button onClick={() => handleSave(PostStatus.PendingApproval)} disabled={isSaving} className="bg-brand-gold text-brand-primary font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50">
            {isSaving ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCreationModal;

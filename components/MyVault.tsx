import React, { useState, useEffect, useRef } from 'react';
import { User, VaultDocument } from '../types';
import { getVaultDocuments, uploadVaultDocument } from '../services/apiService';
import { VaultIcon } from './icons/VaultIcon';
import { UploadIcon } from './icons/UploadIcon';
import { LinkIcon } from './icons/LinkIcon';

interface MyVaultProps {
  currentUser: User;
}

const MyVault: React.FC<MyVaultProps> = ({ currentUser }) => {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await getVaultDocuments(currentUser.id);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch vault documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentUser.id]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
        const newDocData: Omit<VaultDocument, 'id'> = {
            clientId: currentUser.id,
            name: file.name,
            type: 'Other', // A real app would have a way to classify this
            uploadDate: new Date().toISOString(),
            url: '#' // In a real app, this would be the URL from the storage service
        };
      await uploadVaultDocument(newDocData);
      fetchDocuments(); // Refresh the list
    } catch (error) {
        console.error("Failed to upload document", error);
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };


  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <VaultIcon className="w-8 h-8 text-brand-gold" />
          <h2 className="text-2xl font-bold text-brand-text">My Vault</h2>
        </div>
        <button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="bg-brand-gold text-brand-primary font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 disabled:bg-brand-accent disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
                <div className="w-5 h-5 border-2 border-t-transparent border-brand-primary rounded-full animate-spin"></div>
                Uploading...
            </>
          ) : (
            <>
                <UploadIcon className="w-5 h-5" />
                Upload Document
            </>
          )}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      </div>
      
      <div className="flex-1 bg-brand-secondary p-4 rounded-xl shadow-lg overflow-y-auto">
        {isLoading ? (
            <div className="text-center p-8 text-brand-light">Loading documents...</div>
        ) : (
            <table className="w-full text-left table-auto">
                <thead className="border-b border-brand-accent">
                <tr>
                    <th className="p-4 text-sm font-semibold text-brand-light tracking-wider">Document Name</th>
                    <th className="p-4 text-sm font-semibold text-brand-light tracking-wider hidden md:table-cell">Type</th>
                    <th className="p-4 text-sm font-semibold text-brand-light tracking-wider hidden sm:table-cell">Date Uploaded</th>
                    <th className="p-4 text-sm font-semibold text-brand-light tracking-wider">Link</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-brand-accent">
                {documents.map(doc => (
                    <tr key={doc.id} className="hover:bg-brand-accent/30 transition-colors">
                    <td className="p-4 text-brand-text font-medium">{doc.name}</td>
                    <td className="p-4 text-brand-light hidden md:table-cell">{doc.type}</td>
                    <td className="p-4 text-brand-light hidden sm:table-cell">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                    <td className="p-4">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-yellow-400">
                            <LinkIcon className="w-5 h-5" />
                        </a>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )}
        { !isLoading && documents.length === 0 && (
            <div className="text-center p-8 text-brand-light">Your vault is empty. Upload your first document to get started.</div>
        )}
      </div>
    </div>
  );
};

export default MyVault;

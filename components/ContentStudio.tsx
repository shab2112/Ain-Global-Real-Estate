import React, { useState, useEffect } from 'react';
import { DriveProject, User } from '../types';
import { getDriveProjects } from '../services/googleDriveService';
import ContentPlanner from './ContentPlanner';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface ContentStudioProps {
  currentUser: User;
}

const ContentStudio: React.FC<ContentStudioProps> = ({ currentUser }) => {
  const [projects, setProjects] = useState<Omit<DriveProject, 'assets'>[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const fetchedProjects = await getDriveProjects();
        setProjects(fetchedProjects);
        if (fetchedProjects.length > 0) {
          setSelectedProjectId(fetchedProjects[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <DocumentTextIcon className="w-8 h-8 text-brand-gold" />
          <h2 className="text-2xl font-bold text-brand-text">Content Studio & Planner</h2>
        </div>
        <div>
          <label htmlFor="project-select" className="sr-only">Select Project</label>
          <select
            id="project-select"
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={isLoading || projects.length === 0}
            className="bg-brand-secondary border border-brand-accent rounded-md p-2 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition text-brand-text"
          >
            {isLoading ? (
              <option>Loading Projects...</option>
            ) : (
              projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
            )}
          </select>
        </div>
      </div>
      
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md">{error}</div>}

      <div className="flex-1 bg-brand-secondary p-4 rounded-xl shadow-lg overflow-y-auto">
        {selectedProjectId ? (
          <ContentPlanner 
            key={selectedProjectId} 
            projectId={selectedProjectId} 
            currentUser={currentUser} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-brand-light">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-4 border-t-transparent border-brand-gold rounded-full animate-spin"></div>
                <p>Loading project data...</p>
              </div>
            ) : (
              <p>No projects found. Please add projects to your Google Drive.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentStudio;

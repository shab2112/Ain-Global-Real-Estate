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

  const [viewMode, setViewMode] = useState<'FourWeek' | 'Monthly'>('FourWeek');
  const [currentDate, setCurrentDate] = useState(new Date());

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
  
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };


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
              projects.map(p => <option key={p.id} value={p.id}>{p.developer.toUpperCase()} - {p.name}</option>)
            )}
          </select>
        </div>
      </div>
      
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md">{error}</div>}

      <div className="flex-1 bg-brand-secondary p-4 rounded-xl shadow-lg overflow-y-auto flex flex-col gap-4">
         {/* Planner Controls Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
            <div className="flex items-center gap-2 bg-brand-primary p-1 rounded-lg w-fit">
                <button
                    onClick={() => setViewMode('FourWeek')}
                    className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${viewMode === 'FourWeek' ? 'bg-brand-gold text-brand-primary' : 'text-brand-light hover:text-brand-text'}`}
                >
                    4-Week View
                </button>
                <button
                    onClick={() => setViewMode('Monthly')}
                    className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${viewMode === 'Monthly' ? 'bg-brand-gold text-brand-primary' : 'text-brand-light hover:text-brand-text'}`}
                >
                    Monthly View
                </button>
            </div>
            {viewMode === 'Monthly' && (
                <div className="flex items-center gap-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-md hover:bg-brand-primary text-brand-light">&lt; Prev</button>
                    <span className="font-bold text-lg text-brand-text w-36 text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-2 rounded-md hover:bg-brand-primary text-brand-light">Next &gt;</button>
                </div>
            )}
        </div>
        {selectedProjectId ? (
          <ContentPlanner 
            key={selectedProjectId} 
            projectId={selectedProjectId} 
            currentUser={currentUser}
            viewMode={viewMode}
            currentDate={currentDate}
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
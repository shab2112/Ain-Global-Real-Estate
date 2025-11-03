import React, { useState, useEffect, useMemo } from 'react';
import { ContentPost, DriveProject, PostStatus, User, UserRole } from '../types';
import { getProjectAssets } from '../services/googleDriveService';
import { getScheduledPosts, updateContentPost } from '../services/apiService';
import ContentCreationModal from './ContentCreationModal';

interface ContentPlannerProps {
  projectId: string;
  currentUser: User;
}

const getStatusStyles = (status: PostStatus, isOverdue: boolean) => {
    if (isOverdue) return 'bg-red-500/20 text-red-300 ring-red-500';
    switch (status) {
      case PostStatus.Draft:
        return 'bg-gray-500/20 text-gray-300 ring-gray-500';
      case PostStatus.PendingApproval:
        return 'bg-yellow-500/20 text-yellow-300 ring-yellow-500';
      case PostStatus.Approved:
        return 'bg-green-500/20 text-green-300 ring-green-500';
      case PostStatus.Published:
        return 'bg-blue-500/20 text-blue-300 ring-blue-500';
      default:
        return 'bg-brand-primary ring-brand-accent';
    }
};

const ContentPlanner: React.FC<ContentPlannerProps> = ({ projectId, currentUser }) => {
  const [project, setProject] = useState<DriveProject | null>(null);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);

  const fetchPlannerData = async () => {
    try {
      setIsLoading(true);
      const [projectData, scheduledPosts] = await Promise.all([
        getProjectAssets(projectId),
        getScheduledPosts(),
      ]);
      setProject(projectData || null);
      setPosts(scheduledPosts.filter(p => p.projectId === projectId));
    } catch (error) {
      console.error("Failed to load planner data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannerData();
  }, [projectId]);

  // Simulate auto-publishing
  useEffect(() => {
    const interval = setInterval(() => {
        const now = new Date();
        posts.forEach(post => {
            if (post.status === PostStatus.Approved && new Date(post.scheduledDate) <= now) {
                updatePostStatus(post.id, PostStatus.Published, currentUser.id);
            }
        });
    }, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [posts, currentUser.id]);


  const handleOpenModalForNew = (date: Date) => {
    setSelectedDate(date);
    setSelectedPost(null);
    setIsModalOpen(true);
  };
  
  const handleOpenModalForEdit = (post: ContentPost) => {
    setSelectedDate(new Date(post.scheduledDate));
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalSave = () => {
    setIsModalOpen(false);
    fetchPlannerData(); // Refresh data after save
  };

  const updatePostStatus = async (postId: string, status: PostStatus, userId: string) => {
    const updates: Partial<ContentPost> = { status };
    if(status === PostStatus.Approved) {
        updates.approvedBy = userId;
    }
    await updateContentPost(postId, updates);
    fetchPlannerData();
  };

  const calendarDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 0; i < 28; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  }, []);

  if (isLoading) {
    return <div className="text-center p-8">Loading Planner...</div>;
  }
  if (!project) {
    return <div className="text-center p-8">Project data could not be loaded.</div>;
  }
  
  const canApprove = currentUser.role === UserRole.Owner || currentUser.role === UserRole.Admin;

  return (
    <>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-brand-light text-sm">{day}</div>
        ))}
        {calendarDays.map((day) => {
          const dayPosts = posts.filter(p => new Date(p.scheduledDate).toDateString() === day.toDateString());
          return (
            <div key={day.toISOString()} className="bg-brand-primary h-40 rounded-lg p-2 flex flex-col gap-1 overflow-y-auto">
              <div className="font-semibold text-xs">{day.getDate()}</div>
              {dayPosts.map(post => {
                 const isOverdue = post.status === PostStatus.PendingApproval && (new Date(post.scheduledDate).getTime() - Date.now()) < 24 * 60 * 60 * 1000 && (new Date(post.scheduledDate).getTime() > Date.now());
                 return (
                    <div key={post.id} className={`p-1.5 rounded-md text-xs cursor-pointer ring-1 ${getStatusStyles(post.status, isOverdue)}`}>
                       <div className="font-bold truncate" onClick={() => handleOpenModalForEdit(post)}>{post.platform} Post</div>
                       <div className="flex justify-between items-center mt-1">
                          <span className="text-xs opacity-80">{post.status}</span>
                          {canApprove && post.status === PostStatus.PendingApproval && (
                            <button onClick={() => updatePostStatus(post.id, PostStatus.Approved, currentUser.id)} className="px-1 py-0.5 bg-green-500/50 rounded text-green-200 hover:bg-green-500/70 text-[10px]">Approve</button>
                          )}
                       </div>
                    </div>
                 );
              })}
              <button onClick={() => handleOpenModalForNew(day)} className="mt-auto text-center text-xs text-brand-light hover:text-brand-text w-full">+ Schedule</button>
            </div>
          );
        })}
      </div>
      {isModalOpen && selectedDate && (
        <ContentCreationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleModalSave}
            project={project}
            currentUser={currentUser}
            selectedDate={selectedDate}
            post={selectedPost}
        />
      )}
    </>
  );
};

export default ContentPlanner;

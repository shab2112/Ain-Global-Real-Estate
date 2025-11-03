import React, { useState, useEffect, useMemo } from 'react';
import { ContentPost, DriveProject, PostStatus, User, UserRole } from '../types';
import { getProjectAssets } from '../services/googleDriveService';
import { getScheduledPosts, updateContentPost } from '../services/apiService';
import ContentCreationModal from './ContentCreationModal';
import { ImageIcon } from './icons/ImageIcon';
import { VideoIcon } from './icons/VideoIcon';

interface ContentPlannerProps {
  projectId: string;
  currentUser: User;
  viewMode: 'FourWeek' | 'Monthly';
  currentDate: Date;
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

const ContentPlanner: React.FC<ContentPlannerProps> = ({ projectId, currentUser, viewMode, currentDate }) => {
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
    if (viewMode === 'FourWeek') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return Array.from({ length: 28 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            return { date, isCurrentMonth: true };
        });
    } else { // Monthly view
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const days = [];
        
        // Days from previous month to fill the grid
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0=Sun
        for (let i = 0; i < startDayOfWeek; i++) {
            const date = new Date(firstDayOfMonth);
            date.setDate(date.getDate() - (startDayOfWeek - i));
            days.push({ date, isCurrentMonth: false });
        }

        // Days of current month
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        // Days from next month to fill the grid
        const endDayOfWeek = lastDayOfMonth.getDay();
        const remainingDays = (7 - (days.length % 7)) % 7;
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(lastDayOfMonth);
            date.setDate(date.getDate() + i);
            days.push({ date, isCurrentMonth: false });
        }
        return days;
    }
  }, [viewMode, currentDate]);

  if (isLoading) {
    return <div className="text-center p-8">Loading Planner...</div>;
  }
  if (!project) {
    return <div className="text-center p-8">Project data could not be loaded.</div>;
  }
  
  const canApprove = currentUser.role === UserRole.Owner || currentUser.role === UserRole.Admin;

  return (
    <>
      <div className={`grid gap-2 ${viewMode === 'FourWeek' ? 'grid-cols-4' : 'grid-cols-7'}`}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-brand-light text-sm mb-2">{day}</div>
        ))}
        {calendarDays.map(({ date, isCurrentMonth }) => {
          const dayPosts = posts.filter(p => new Date(p.scheduledDate).toDateString() === date.toDateString());
          return (
            <div key={date.toISOString()} className={`bg-brand-primary h-40 rounded-lg p-2 flex flex-col gap-1 overflow-y-auto ${!isCurrentMonth ? 'opacity-40' : ''}`}>
              <div className={`font-semibold text-xs ${isCurrentMonth ? 'text-brand-text' : 'text-brand-light/70'}`}>{date.getDate()}</div>
              {dayPosts.map(post => {
                 const isOverdue = post.status === PostStatus.PendingApproval && (new Date(post.scheduledDate).getTime() - Date.now()) < 0;
                 const PostIcon = post.postType === 'Video' ? VideoIcon : ImageIcon;
                 return (
                    <div key={post.id} className={`p-1.5 rounded-md text-xs cursor-pointer ring-1 ${getStatusStyles(post.status, isOverdue)}`}>
                       <div className="font-bold truncate flex items-center gap-1.5" onClick={() => handleOpenModalForEdit(post)}>
                         <PostIcon className="w-3.5 h-3.5 shrink-0" />
                         {post.platform} Post
                       </div>
                       <div className="flex justify-between items-center mt-1">
                          <span className="text-xs opacity-80">{post.status}</span>
                          {canApprove && post.status === PostStatus.PendingApproval && (
                            <button onClick={() => updatePostStatus(post.id, PostStatus.Approved, currentUser.id)} className="px-1 py-0.5 bg-green-500/50 rounded text-green-200 hover:bg-green-500/70 text-[10px]">Approve</button>
                          )}
                       </div>
                    </div>
                 );
              })}
              {isCurrentMonth && (
                <button onClick={() => handleOpenModalForNew(date)} className="mt-auto text-center text-xs text-brand-light hover:text-brand-text w-full">+ Schedule</button>
              )}
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
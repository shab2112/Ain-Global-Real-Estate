import React, { useState, useEffect } from 'react';
import { getScheduledPosts } from '../services/apiService';
import { User, PostStatus, UserRole } from '../types';
import { BellIcon } from './icons/BellIcon';

interface NotificationBellProps {
    currentUser: User;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ currentUser }) => {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        // Only staff members (not clients) should see notifications
        if (currentUser.role === UserRole.Client) {
            setPendingCount(0);
            return;
        }

        const fetchPendingPosts = async () => {
            try {
                const posts = await getScheduledPosts();
                const count = posts.filter(p => p.status === PostStatus.PendingApproval).length;
                setPendingCount(count);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        fetchPendingPosts();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchPendingPosts, 30000);

        return () => clearInterval(interval);
    }, [currentUser.role]);


    // Do not render the bell for clients
    if (currentUser.role === UserRole.Client) {
        return null;
    }

    return (
        <div className="relative">
            <button className="p-2 rounded-full hover:bg-brand-accent transition-colors">
                <BellIcon className="w-6 h-6 text-brand-light" />
                {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {pendingCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default NotificationBell;

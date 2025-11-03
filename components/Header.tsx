import React from 'react';
import { User } from '../types';
import UserSwitcher from './UserSwitcher';
import NotificationBell from './NotificationBell';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
}

const Header: React.FC<HeaderProps> = ({ currentUser, setCurrentUser, allUsers }) => {
  return (
    <header className="bg-brand-primary border-b border-brand-accent p-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-brand-gold" />
        <h1 className="text-xl font-bold text-brand-text tracking-wider hidden sm:block">
          Lockwood & Carter
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell currentUser={currentUser} />
        <UserSwitcher 
            users={allUsers}
            selectedUser={currentUser}
            onSelectUser={setCurrentUser}
        />
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface UserSwitcherProps {
  users: User[];
  selectedUser: User;
  onSelectUser: (user: User) => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ users, selectedUser, onSelectUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (user: User) => {
    onSelectUser(user);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg bg-brand-primary hover:bg-brand-accent transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-primary flex items-center justify-center font-bold">
          {selectedUser.avatar}
        </div>
        <div className="text-left hidden md:block">
          <p className="font-bold text-sm text-brand-text">{selectedUser.name}</p>
          <p className="text-xs text-brand-light">{selectedUser.role}</p>
        </div>
        <UserCircleIcon className="w-5 h-5 text-brand-light hidden md:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-brand-secondary rounded-lg shadow-xl border border-brand-accent z-20">
          <div className="p-2">
            <p className="text-xs text-brand-light px-2 py-1">Switch User Profile</p>
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => handleSelect(user)}
                className={`w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-brand-accent transition-colors ${
                  selectedUser.id === user.id ? 'bg-brand-accent' : ''
                }`}
              >
                 <div className="w-7 h-7 rounded-full bg-brand-gold text-brand-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {user.avatar}
                 </div>
                 <div>
                    <p className="text-sm font-semibold text-brand-text">{user.name}</p>
                    <p className="text-xs text-brand-light">{user.role}</p>
                 </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSwitcher;
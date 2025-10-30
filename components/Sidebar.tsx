
import React from 'react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', active: false },
    { name: 'Content Studio', active: true },
    { name: 'Campaigns', active: false },
    { name: 'Market Intelligence', active: false },
    { name: 'Clients', active: false },
  ];

  return (
    <aside className="w-16 md:w-64 bg-brand-secondary p-2 md:p-4 transition-all duration-300">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center p-3 rounded-lg transition-colors ${
              item.active
                ? 'bg-brand-gold text-brand-primary font-bold'
                : 'text-brand-light hover:bg-brand-accent hover:text-brand-text'
            }`}
          >
            <span className="md:hidden text-2xl">
              {item.name.charAt(0)}
            </span>
            <span className="hidden md:inline">{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

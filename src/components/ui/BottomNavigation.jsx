import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'Home',
      path: '/student-dashboard',
      badgeCount: 0,
      ariaLabel: 'Go to dashboard',
      tooltip: 'View your dashboard and recent activity'
    },
    {
      id: 'browse',
      label: 'Browse',
      icon: 'Search',
      path: '/browse-questions',
      badgeCount: 0,
      ariaLabel: 'Browse questions',
      tooltip: 'Discover questions by courses and subjects'
    },
    {
      id: 'ask',
      label: 'Ask',
      icon: 'Plus',
      path: '/ask-question',
      badgeCount: 0,
      ariaLabel: 'Ask a question',
      tooltip: 'Post a new question'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      path: '/user-profile',
      badgeCount: 0,
      ariaLabel: 'View profile',
      tooltip: 'Manage your profile and settings'
    }
  ];

  const isAuthPage = location.pathname === '/user-registration' || location.pathname === '/student-login';

  if (isAuthPage) {
    return null;
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-100 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16 px-4">
        {navigationItems?.map((item) => {
          const isActive = location.pathname === item?.path;
          
          return (
            <Link
              key={item?.id}
              to={item?.path}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors duration-200 ${
                isActive 
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
              aria-label={item?.ariaLabel}
              title={item?.tooltip}
            >
              <div className="relative">
                <Icon 
                  name={item?.icon} 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item?.badgeCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center animate-fade-in">
                    <span className="text-xs font-medium text-accent-foreground">
                      {item?.badgeCount > 99 ? '99+' : item?.badgeCount}
                    </span>
                  </div>
                )}
              </div>
              <span 
                className={`text-xs font-medium mt-1 truncate w-full text-center ${
                  isActive ? 'font-semibold' : ''
                }`}
              >
                {item?.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
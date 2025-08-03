import React from 'react';

const NotificationBadge = ({ 
  count = 0, 
  maxCount = 99, 
  showZero = false, 
  size = 'default',
  variant = 'default',
  className = '',
  children 
}) => {
  const shouldShow = count > 0 || showZero;
  
  if (!shouldShow) {
    return children || null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count?.toString();
  
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    default: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  };

  const variantClasses = {
    default: 'bg-accent text-accent-foreground',
    primary: 'bg-primary text-primary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    error: 'bg-error text-error-foreground'
  };

  const badgeElement = (
    <div 
      className={`
        ${sizeClasses?.[size]} 
        ${variantClasses?.[variant]} 
        rounded-full flex items-center justify-center font-medium animate-fade-in
        ${className}
      `}
    >
      {displayCount}
    </div>
  );

  if (children) {
    return (
      <div className="relative inline-block">
        {children}
        <div className="absolute -top-1 -right-1">
          {badgeElement}
        </div>
      </div>
    );
  }

  return badgeElement;
};

export default NotificationBadge;
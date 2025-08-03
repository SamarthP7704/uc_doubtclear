import React from 'react';
import Icon from '../AppIcon';

const StatusIndicator = ({ 
  status = 'pending', 
  size = 'default',
  showLabel = false,
  showTooltip = false,
  className = '' 
}) => {
  const statusConfig = {
    pending: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: 'Clock',
      label: 'Pending',
      description: 'Question is waiting for answers'
    },
    answered: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      icon: 'CheckCircle',
      label: 'Answered',
      description: 'Question has been answered'
    },
    'ai-assisted': {
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      icon: 'Bot',
      label: 'AI Assisted',
      description: 'AI provided assistance for this question'
    },
    closed: {
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      icon: 'Lock',
      label: 'Closed',
      description: 'Question is closed for new answers'
    },
    urgent: {
      color: 'text-error',
      bgColor: 'bg-error/10',
      icon: 'AlertCircle',
      label: 'Urgent',
      description: 'Question requires immediate attention'
    }
  };

  const config = statusConfig?.[status] || statusConfig?.pending;
  
  const sizeClasses = {
    sm: showLabel ? 'px-2 py-1 text-xs' : 'w-6 h-6',
    default: showLabel ? 'px-3 py-1.5 text-sm' : 'w-8 h-8',
    lg: showLabel ? 'px-4 py-2 text-base' : 'w-10 h-10'
  };

  const iconSizes = {
    sm: 12,
    default: 16,
    lg: 20
  };

  if (showLabel) {
    return (
      <div 
        className={`
          inline-flex items-center space-x-2 rounded-full font-medium transition-colors
          ${config?.bgColor} ${config?.color} ${sizeClasses?.[size]} ${className}
        `}
        title={showTooltip ? config?.description : undefined}
      >
        <Icon name={config?.icon} size={iconSizes?.[size]} />
        <span>{config?.label}</span>
      </div>
    );
  }

  return (
    <div 
      className={`
        inline-flex items-center justify-center rounded-full transition-colors
        ${config?.bgColor} ${config?.color} ${sizeClasses?.[size]} ${className}
      `}
      title={showTooltip ? config?.description : undefined}
    >
      <Icon name={config?.icon} size={iconSizes?.[size]} />
    </div>
  );
};

export default StatusIndicator;
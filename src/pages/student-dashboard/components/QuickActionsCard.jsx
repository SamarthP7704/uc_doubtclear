import React from 'react';
import Icon from '../../../components/AppIcon';
import { Link } from 'react-router-dom';

const QuickActionsCard = () => {
  const quickActions = [
    {
      id: 'ask-question',
      title: 'Ask Question',
      description: 'Get help from peers',
      icon: 'Plus',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      path: '/ask-question'
    },
    {
      id: 'browse-questions',
      title: 'Browse Questions',
      description: 'Find existing answers',
      icon: 'Search',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      path: '/browse'
    },
    {
      id: 'my-questions',
      title: 'My Questions',
      description: 'Track your posts',
      icon: 'User',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      path: '/my-questions'
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      description: 'See top contributors',
      icon: 'Trophy',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      path: '/leaderboard'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-card">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {quickActions?.map((action) => (
          <Link
            key={action?.id}
            to={action?.path}
            className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-lg ${action?.bgColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
              <Icon name={action?.icon} size={20} className={action?.color} />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">{action?.title}</h3>
            <p className="text-xs text-muted-foreground">{action?.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCard;
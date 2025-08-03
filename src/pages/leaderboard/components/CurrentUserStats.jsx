import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CurrentUserStats = ({ user, rank, compact = false }) => {
  const stats = [
    {
      label: 'Total Points',
      value: user?.points?.toLocaleString() || '0',
      icon: 'Star',
      color: 'text-primary'
    },
    {
      label: 'Current Rank',
      value: rank ? `#${rank}` : 'Unranked',
      icon: 'Trophy',
      color: 'text-yellow-500'
    },
    {
      label: 'Weekly Growth',
      value: user?.weekly_growth > 0 ? `+${user?.weekly_growth}` : user?.weekly_growth || '0',
      icon: user?.weekly_growth > 0 ? 'TrendingUp' : 'TrendingDown',
      color: user?.weekly_growth > 0 ? 'text-success' : 'text-muted-foreground'
    }
  ];

  const achievements = [
    { name: 'Questions Asked', count: user?.questions_count || 0, icon: 'HelpCircle' },
    { name: 'Answers Given', count: user?.answers_count || 0, icon: 'MessageCircle' },
    { name: 'Accepted Answers', count: user?.accepted_answers_count || 0, icon: 'CheckCircle' },
    { name: 'Helpful Votes', count: user?.helpful_votes_count || 0, icon: 'ThumbsUp' }
  ];

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar_url ? (
              <img
                src={user?.avatar_url}
                alt={user?.full_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <Icon name="User" size={20} className="text-primary" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {user?.full_name}
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-primary font-medium">
                {user?.points?.toLocaleString() || '0'} points
              </span>
              <span className="text-muted-foreground">
                {rank ? `#${rank}` : 'Unranked'}
              </span>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link to="/user-profile">
              View Profile
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
          {user?.avatar_url ? (
            <img
              src={user?.avatar_url}
              alt={user?.full_name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <Icon name="User" size={32} className="text-muted-foreground" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {user?.full_name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {user?.email}
        </p>
      </div>

      {/* Key Stats */}
      <div className="space-y-4 mb-6">
        {stats?.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name={stat?.icon} size={16} className={stat?.color} />
              <span className="text-sm text-muted-foreground">
                {stat?.label}
              </span>
            </div>
            <span className={`font-semibold ${stat?.color}`}>
              {stat?.value}
            </span>
          </div>
        ))}
      </div>

      {/* Activity Summary */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-foreground text-sm">Activity Summary</h4>
        <div className="grid grid-cols-2 gap-3">
          {achievements?.map((achievement, index) => (
            <div key={index} className="text-center p-2 bg-muted/50 rounded">
              <Icon 
                name={achievement?.icon} 
                size={16} 
                className="mx-auto mb-1 text-muted-foreground" 
              />
              <div className="font-semibold text-sm text-foreground">
                {achievement?.count}
              </div>
              <div className="text-xs text-muted-foreground">
                {achievement?.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Button
        asChild
        variant="outline"
        fullWidth
        iconName="User"
      >
        <Link to="/user-profile">
          View Full Profile
        </Link>
      </Button>
    </div>
  );
};

export default CurrentUserStats;
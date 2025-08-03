import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ stats }) => {
  const statItems = [
    {
      icon: 'HelpCircle',
      label: 'Questions Asked',
      value: stats?.questionsAsked || 0,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: 'MessageCircle',
      label: 'Answers Given',
      value: stats?.answersGiven || 0,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      icon: 'CheckCircle',
      label: 'Accepted Answers',
      value: stats?.acceptedAnswers || 0,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      icon: 'Award',
      label: 'Badges Earned',
      value: stats?.badgesEarned || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Activity Overview</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        {statItems?.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${item?.bgColor}`}>
              <Icon name={item?.icon} size={16} className={item?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {item?.value}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item?.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Progress */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Recent Achievements</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="Award" size={12} className="text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">First Answer</p>
              <p className="text-xs text-muted-foreground">Answered your first question</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="ThumbsUp" size={12} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">Helpful Contributor</p>
              <p className="text-xs text-muted-foreground">Received 10+ upvotes</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Users" size={12} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">Community Member</p>
              <p className="text-xs text-muted-foreground">Active for 30+ days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
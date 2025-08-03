import React from 'react';
import Icon from '../../../components/AppIcon';

const SocialProofSection = () => {
  const stats = [
    {
      id: 1,
      icon: 'Users',
      value: '2,847',
      label: 'Active Students',
      color: 'text-primary'
    },
    {
      id: 2,
      icon: 'MessageCircle',
      value: '156',
      label: 'Questions Today',
      color: 'text-success'
    },
    {
      id: 3,
      icon: 'CheckCircle',
      value: '89%',
      label: 'Questions Answered',
      color: 'text-accent'
    },
    {
      id: 4,
      icon: 'Clock',
      value: '< 15min',
      label: 'Avg Response Time',
      color: 'text-secondary'
    }
  ];

  const recentActivity = [
    "Sarah M. just answered a Calculus question",
    "Mike R. earned 50 points for helping peers",
    "Emma L. solved a Chemistry problem",
    "Alex K. received 5-star rating"
  ];

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Join Our Learning Community
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {stats?.map((stat) => (
            <div key={stat?.id} className="text-center">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted mb-2`}>
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              </div>
              <div className="text-lg font-semibold text-foreground">{stat?.value}</div>
              <div className="text-xs text-muted-foreground">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Activity" size={20} className="mr-2 text-primary" />
          Live Activity
        </h3>
        
        <div className="space-y-3">
          {recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">{activity}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Why Students Trust UC DoubtClear
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">UC Email Verified Students Only</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Award" size={16} className="text-accent" />
            <span className="text-sm text-muted-foreground">Peer-Reviewed Answers</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Bot" size={16} className="text-secondary" />
            <span className="text-sm text-muted-foreground">AI-Powered Fallback Support</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">24/7 Academic Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofSection;
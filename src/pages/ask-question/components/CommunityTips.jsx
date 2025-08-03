import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunityTips = () => {
  const tips = [
    {
      id: 1,
      icon: 'Clock',
      title: 'Response Time',
      description: 'Most questions get answered within 2-4 hours during peak study times (6-10 PM).',
      color: 'text-primary'
    },
    {
      id: 2,
      icon: 'Users',
      title: 'Active Community',
      description: 'Over 2,500 UC students are ready to help with your academic questions.',
      color: 'text-success'
    },
    {
      id: 3,
      icon: 'Award',
      title: 'Quality Answers',
      description: 'Top contributors earn brownie points and recognition on our leaderboard.',
      color: 'text-accent'
    },
    {
      id: 4,
      icon: 'Bot',
      title: 'AI Fallback',
      description: 'If no peer answers within 15 minutes, our AI assistant will provide guidance.',
      color: 'text-secondary'
    }
  ];

  const quickStats = [
    { label: 'Questions Asked Today', value: '127', icon: 'MessageSquare' },
    { label: 'Average Response Time', value: '3.2h', icon: 'Clock' },
    { label: 'Success Rate', value: '94%', icon: 'CheckCircle' },
    { label: 'Active Helpers', value: '89', icon: 'Users' }
  ];

  return (
    <div className="space-y-4">
      {/* Community Tips */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Lightbulb" size={20} className="text-accent" />
          <h3 className="font-medium text-foreground">Community Tips</h3>
        </div>

        <div className="space-y-3">
          {tips?.map((tip) => (
            <div key={tip?.id} className="flex items-start space-x-3">
              <Icon name={tip?.icon} size={16} className={`${tip?.color} mt-0.5 flex-shrink-0`} />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">{tip?.title}</p>
                <p className="text-xs text-muted-foreground">{tip?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="font-medium text-foreground">Today's Activity</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickStats?.map((stat, index) => (
            <div key={index} className="text-center p-2 bg-muted/30 rounded-lg">
              <Icon name={stat?.icon} size={16} className="text-primary mx-auto mb-1" />
              <p className="text-lg font-semibold text-foreground">{stat?.value}</p>
              <p className="text-xs text-muted-foreground">{stat?.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Best Practices */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Star" size={20} className="text-primary" />
          <h3 className="font-medium text-foreground">Best Practices</h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={12} className="text-success" />
            <span className="text-xs text-foreground">Include course code and topic</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={12} className="text-success" />
            <span className="text-xs text-foreground">Show your attempted solution</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={12} className="text-success" />
            <span className="text-xs text-foreground">Use clear, descriptive titles</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={12} className="text-success" />
            <span className="text-xs text-foreground">Thank helpful contributors</span>
          </div>
        </div>
      </div>
      {/* Emergency Help */}
      <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="AlertTriangle" size={16} className="text-warning" />
          <h4 className="text-sm font-medium text-foreground">Need Urgent Help?</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          For time-sensitive questions (exams, deadlines), use the "urgent" tag to get faster responses.
        </p>
        <div className="flex items-center space-x-2 text-xs text-warning">
          <Icon name="Clock" size={12} />
          <span>Urgent questions typically get answered within 30 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityTips;
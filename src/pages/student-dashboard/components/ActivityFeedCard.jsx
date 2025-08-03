import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeedCard = ({ activities }) => {
  const getActivityConfig = (type) => {
    const configs = {
      'question-answered': {
        icon: 'MessageSquare',
        color: 'text-success',
        bgColor: 'bg-success/10',
        title: 'Question Answered'
      },
      'answer-upvoted': {
        icon: 'ThumbsUp',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        title: 'Answer Upvoted'
      },
      'question-bookmarked': {
        icon: 'Bookmark',
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        title: 'Question Bookmarked'
      },
      'points-earned': {
        icon: 'Star',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        title: 'Points Earned'
      },
      'rank-improved': {
        icon: 'TrendingUp',
        color: 'text-success',
        bgColor: 'bg-success/10',
        title: 'Rank Improved'
      }
    };
    return configs?.[type] || configs?.['question-answered'];
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity) => {
          const config = getActivityConfig(activity?.type);
          
          return (
            <div key={activity?.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full ${config?.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon name={config?.icon} size={16} className={config?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-foreground">{config?.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity?.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {activity?.description}
                </p>
                
                {activity?.relatedUser && (
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image 
                        src={activity?.relatedUser?.avatar} 
                        alt={activity?.relatedUser?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      by {activity?.relatedUser?.name}
                    </span>
                  </div>
                )}
                
                {activity?.pointsEarned && (
                  <div className="inline-flex items-center space-x-1 mt-2 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    <Icon name="Star" size={12} />
                    <span>+{activity?.pointsEarned} points</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {activities?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No recent activity</p>
          <p className="text-xs text-muted-foreground">Start asking questions to see your activity here</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeedCard;
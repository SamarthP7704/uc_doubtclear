import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const UserRankCard = ({ 
  user, 
  rank, 
  period = 'all', 
  isCurrentUser = false, 
  showCourse = false 
}) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Icon name="Crown" size={20} className="text-yellow-500" />;
      case 2:
        return <Icon name="Medal" size={20} className="text-gray-400" />;
      case 3:
        return <Icon name="Award" size={20} className="text-amber-600" />;
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground">
              {rank}
            </span>
          </div>
        );
    }
  };

  const getPointsForPeriod = () => {
    switch (period) {
      case 'weekly':
        return user?.weekly_growth || 0;
      case 'monthly':
        return user?.monthly_points || 0;
      case 'daily':
        return user?.daily_points || 0;
      default:
        return user?.points || 0;
    }
  };

  const getGrowthIndicator = () => {
    const growth = user?.weekly_growth || 0;
    if (growth > 0) {
      return (
        <div className="flex items-center text-success text-xs">
          <Icon name="TrendingUp" size={12} className="mr-1" />
          +{growth}
        </div>
      );
    } else if (growth < 0) {
      return (
        <div className="flex items-center text-destructive text-xs">
          <Icon name="TrendingDown" size={12} className="mr-1" />
          {growth}
        </div>
      );
    }
    return null;
  };

  const points = getPointsForPeriod();

  return (
    <Link
      to={`/user-profile/${user?.id}`}
      className={`block bg-card border rounded-lg p-4 hover:border-border-hover transition-all duration-200 group ${
        isCurrentUser ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-border'
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Rank */}
        <div className="flex-shrink-0">
          {getRankIcon(rank)}
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar_url ? (
              <img
                src={user?.avatar_url}
                alt={user?.full_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <Icon name="User" size={20} className="text-muted-foreground" />
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {user?.full_name}
              {isCurrentUser && (
                <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  You
                </span>
              )}
            </h3>
            {user?.role === 'instructor' && (
              <Icon name="GraduationCap" size={14} className="text-primary" />
            )}
          </div>
          
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            {showCourse && user?.course && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                {user?.course?.code}
              </span>
            )}
          </div>

          {/* Activity Stats */}
          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="MessageCircle" size={12} />
              <span>{user?.answers_count || 0} answers</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="HelpCircle" size={12} />
              <span>{user?.questions_count || 0} questions</span>
            </div>
            {user?.accepted_answers_count > 0 && (
              <div className="flex items-center space-x-1 text-success">
                <Icon name="CheckCircle" size={12} />
                <span>{user?.accepted_answers_count} accepted</span>
              </div>
            )}
          </div>
        </div>

        {/* Points & Growth */}
        <div className="flex-shrink-0 text-right space-y-1">
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="font-bold text-lg text-foreground">
                {points?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {period === 'all' ? 'total' : period} points
              </div>
            </div>
            <Icon name="Star" size={16} className="text-primary" />
          </div>
          
          {period === 'all' && getGrowthIndicator()}
        </div>
      </div>

      {/* Achievement Badges Preview */}
      {user?.badges?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Recent badges:</span>
            <div className="flex space-x-1">
              {user?.badges?.slice(0, 3)?.map((badge, index) => (
                <div
                  key={index}
                  className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center"
                  title={badge?.name}
                >
                  <Icon name={badge?.icon || "Award"} size={12} className="text-primary" />
                </div>
              ))}
              {user?.badges?.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{user?.badges?.length - 3} more
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};

export default UserRankCard;
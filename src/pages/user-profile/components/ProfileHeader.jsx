import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProfileHeader = ({ user, stats, onEditProfile, onSettings }) => {
  const getInitials = (name) => {
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase() || 'U';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return { icon: 'TrendingUp', color: 'text-success' };
    if (growth < 0) return { icon: 'TrendingDown', color: 'text-error' };
    return { icon: 'Minus', color: 'text-muted-foreground' };
  };

  const growthDisplay = getGrowthIcon(stats?.weeklyGrowth || 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Profile Info */}
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="relative">
            {user?.avatar_url ? (
              <img
                src={user?.avatar_url}
                alt={user?.full_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-border">
                <span className="text-xl sm:text-2xl font-bold text-primary">
                  {getInitials(user?.full_name)}
                </span>
              </div>
            )}
            
            {/* Online status indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full border-2 border-card"></div>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                {user?.full_name || 'User Profile'}
              </h1>
              {user?.role === 'instructor' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Icon name="GraduationCap" size={12} className="mr-1" />
                  Instructor
                </span>
              )}
            </div>
            
            <p className="text-muted-foreground mb-2">
              {user?.email}
            </p>

            {/* Quick Stats */}
            <div className="flex items-center space-x-4 text-sm">
              {/* Points */}
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-warning" />
                <span className="font-medium text-foreground">{stats?.totalPoints || 0}</span>
                <span className="text-muted-foreground">points</span>
              </div>

              {/* Rank */}
              <div className="flex items-center space-x-1">
                <Icon name="Trophy" size={14} className="text-success" />
                <span className="font-medium text-foreground">#{stats?.rank || 0}</span>
                <span className="text-muted-foreground">rank</span>
              </div>

              {/* Weekly Growth */}
              <div className="flex items-center space-x-1">
                <Icon name={growthDisplay?.icon} size={14} className={growthDisplay?.color} />
                <span className={`font-medium ${growthDisplay?.color}`}>
                  {stats?.weeklyGrowth > 0 ? '+' : ''}{stats?.weeklyGrowth || 0}
                </span>
                <span className="text-muted-foreground">this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditProfile}
            iconName="Edit"
            className="sm:px-4"
          >
            <span className="hidden sm:inline">Edit Profile</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            iconName="Settings"
            className="sm:px-4"
          >
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Profile Completion</span>
          <span className="text-sm text-muted-foreground">{stats?.profileCompletion || 0}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${stats?.profileCompletion || 0}%` }}
          ></div>
        </div>
        {(stats?.profileCompletion || 0) < 100 && (
          <p className="text-xs text-muted-foreground mt-1">
            Complete your profile to improve visibility and earn bonus points
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
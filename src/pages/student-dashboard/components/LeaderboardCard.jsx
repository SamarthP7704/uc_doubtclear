import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { userService } from '../../../services/userService';
import Icon from '../../../components/AppIcon';

const LeaderboardCard = ({ currentUser }) => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await userService?.getLeaderboard({ limit: 10 });
      
      if (error) {
        setError('Failed to load leaderboard');
        return;
      }
      
      // Fix: Handle the nested data structure and ensure it's always an array
      const users = data?.users || [];
      setLeaderboardData(Array.isArray(users) ? users : []);
    } catch (error) {
      setError('Failed to load leaderboard');
      setLeaderboardData([]); // Ensure it's always an array on error
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return { icon: 'Crown', color: 'text-yellow-500' };
      case 2:
        return { icon: 'Medal', color: 'text-gray-400' };
      case 3:
        return { icon: 'Award', color: 'text-orange-500' };
      default:
        return { icon: 'User', color: 'text-muted-foreground' };
    }
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'top-contributor': 'bg-yellow-100 text-yellow-800',
      'helpful': 'bg-green-100 text-green-800',
      'expert': 'bg-blue-100 text-blue-800',
      'mentor': 'bg-purple-100 text-purple-800',
      'rising-star': 'bg-orange-100 text-orange-800',
      'contributor': 'bg-gray-100 text-gray-800'
    };
    return colors?.[badge] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Leaderboard</h2>
          <Icon name="Loader2" size={20} className="animate-spin text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {[...Array(5)]?.map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Leaderboard</h2>
        <button
          onClick={loadLeaderboard}
          disabled={loading}
          className="p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label="Refresh leaderboard"
        >
          <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
        </button>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}
      {(leaderboardData || [])?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No leaderboard data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(leaderboardData || [])?.map((userData, index) => {
            const rank = index + 1;
            const rankInfo = getRankIcon(rank);
            const isCurrentUser = user?.id === userData?.id;
            const badges = userData?.badges || [];
            
            return (
              <div
                key={userData?.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isCurrentUser 
                    ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted/50'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8">
                  {rank <= 3 ? (
                    <Icon 
                      name={rankInfo?.icon} 
                      size={20} 
                      className={rankInfo?.color} 
                    />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">
                      {rank}
                    </span>
                  )}
                </div>
                {/* Avatar */}
                <div className="relative">
                  {userData?.avatar_url ? (
                    <img
                      src={userData?.avatar_url}
                      alt={userData?.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  {isCurrentUser && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground">•</span>
                    </div>
                  )}
                </div>
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-foreground truncate">
                      {userData?.full_name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-primary font-medium">
                          (You)
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {userData?.points?.toLocaleString() || '0'} pts
                    </span>
                    <span className={`text-xs font-medium ${getGrowthColor(userData?.weekly_growth)}`}>
                      {userData?.weekly_growth > 0 ? '+' : ''}{userData?.weekly_growth || 0}
                    </span>
                  </div>

                  {/* Badges */}
                  {badges?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {badges?.slice(0, 2)?.map((badge, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                        >
                          {badge?.replace('-', ' ')}
                        </span>
                      ))}
                      {badges?.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{badges?.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* View Full Leaderboard */}
          <div className="pt-4 border-t border-border">
            <button
              onClick={() => window.location.href = '/leaderboard'}
              className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View Full Leaderboard
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardCard;
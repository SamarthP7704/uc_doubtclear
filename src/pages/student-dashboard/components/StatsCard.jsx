import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { userService } from '../../../services/userService';
import Icon from '../../../components/AppIcon';

const StatsCard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    points: 0,
    rank: 0,
    questionsAsked: 0,
    answersGiven: 0,
    weeklyGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await userService?.getUserStats(user?.id);
      
      if (error) {
        setError('Failed to load stats');
        return;
      }
      
      setStats(data || {
        points: 0,
        rank: 0,
        questionsAsked: 0,
        answersGiven: 0,
        weeklyGrowth: 0
      });
    } catch (error) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return 'TrendingUp';
    if (growth < 0) return 'TrendingDown';
    return 'Minus';
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Stats</h2>
          <Icon name="Loader2" size={20} className="animate-spin text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)]?.map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Your Stats</h2>
        <button
          onClick={loadUserStats}
          disabled={loading}
          className="p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label="Refresh stats"
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

      <div className="grid grid-cols-2 gap-6">
        {/* Points */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Icon name="Star" size={20} className="text-yellow-500 mr-2" />
            <span className="text-2xl font-bold text-foreground">
              {stats?.points?.toLocaleString() || '0'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Total Points</p>
        </div>

        {/* Rank */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Icon name="Trophy" size={20} className="text-orange-500 mr-2" />
            <span className="text-2xl font-bold text-foreground">
              #{stats?.rank || '0'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Rank</p>
        </div>

        {/* Questions Asked */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Icon name="HelpCircle" size={20} className="text-blue-500 mr-2" />
            <span className="text-2xl font-bold text-foreground">
              {stats?.questionsAsked || '0'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Questions</p>
        </div>

        {/* Answers Given */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Icon name="MessageSquare" size={20} className="text-green-500 mr-2" />
            <span className="text-2xl font-bold text-foreground">
              {stats?.answersGiven || '0'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Answers</p>
        </div>
      </div>

      {/* Weekly Growth */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-2">
          <Icon 
            name={getGrowthIcon(stats?.weeklyGrowth)} 
            size={16} 
            className={getGrowthColor(stats?.weeklyGrowth)} 
          />
          <span className={`text-sm font-medium ${getGrowthColor(stats?.weeklyGrowth)}`}>
            {stats?.weeklyGrowth > 0 ? '+' : ''}{stats?.weeklyGrowth || 0} points this week
          </span>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Weekly Growth
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 space-y-2">
        <button
          onClick={() => window.location.href = '/ask-question'}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Ask Question
        </button>
        <button
          onClick={() => window.location.href = '/browse-questions'}
          className="w-full bg-muted text-foreground hover:bg-muted/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Icon name="Search" size={16} className="mr-2" />
          Browse Questions
        </button>
      </div>
    </div>
  );
};

export default StatsCard;
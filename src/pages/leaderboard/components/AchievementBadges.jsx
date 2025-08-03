import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { userService } from '../../../services/userService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AchievementBadges = ({ preview = false }) => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Available achievement badges
  const allBadges = [
    {
      id: 'first_question',
      name: 'First Question',
      description: 'Asked your first question',
      icon: 'HelpCircle',
      color: 'bg-blue-500',
      requirement: 1,
      type: 'questions'
    },
    {
      id: 'first_answer',
      name: 'First Answer',
      description: 'Provided your first answer',
      icon: 'MessageCircle',
      color: 'bg-green-500',
      requirement: 1,
      type: 'answers'
    },
    {
      id: 'helpful_contributor',
      name: 'Helpful Contributor',
      description: 'Received 10 upvotes on answers',
      icon: 'ThumbsUp',
      color: 'bg-orange-500',
      requirement: 10,
      type: 'upvotes'
    },
    {
      id: 'knowledge_seeker',
      name: 'Knowledge Seeker',
      description: 'Asked 10 questions',
      icon: 'BookOpen',
      color: 'bg-purple-500',
      requirement: 10,
      type: 'questions'
    },
    {
      id: 'answer_machine',
      name: 'Answer Machine',
      description: 'Provided 25 answers',
      icon: 'Zap',
      color: 'bg-yellow-500',
      requirement: 25,
      type: 'answers'
    },
    {
      id: 'accepted_expert',
      name: 'Accepted Expert',
      description: 'Had 5 answers accepted',
      icon: 'CheckCircle',
      color: 'bg-emerald-500',
      requirement: 5,
      type: 'accepted'
    },
    {
      id: 'community_star',
      name: 'Community Star',
      description: 'Reached 100 brownie points',
      icon: 'Star',
      color: 'bg-pink-500',
      requirement: 100,
      type: 'points'
    },
    {
      id: 'top_contributor',
      name: 'Top Contributor',
      description: 'Reached top 10 in leaderboard',
      icon: 'Crown',
      color: 'bg-gold-500',
      requirement: 10,
      type: 'rank'
    },
    {
      id: 'consistent_learner',
      name: 'Consistent Learner',
      description: 'Active for 7 consecutive days',
      icon: 'Calendar',
      color: 'bg-indigo-500',
      requirement: 7,
      type: 'streak'
    },
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Helped 50+ students with answers',
      icon: 'GraduationCap',
      color: 'bg-teal-500',
      requirement: 50,
      type: 'answers'
    }
  ];

  useEffect(() => {
    if (preview) {
      // Show only first few badges for preview
      setBadges(allBadges?.slice(0, 6));
      setLoading(false);
    } else {
      fetchBadges();
    }
  }, [preview]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      
      // Get user's achievements
      if (user) {
        const { data: userData } = await userService?.getUserProfile(user?.id);
        const userStats = userData || {};
        
        // Calculate which badges user has earned
        const earnedBadges = allBadges?.filter(badge => {
          switch (badge?.type) {
            case 'questions':
              return (userStats?.questions_count || 0) >= badge?.requirement;
            case 'answers':
              return (userStats?.answers_count || 0) >= badge?.requirement;
            case 'upvotes':
              return (userStats?.helpful_votes_count || 0) >= badge?.requirement;
            case 'accepted':
              return (userStats?.accepted_answers_count || 0) >= badge?.requirement;
            case 'points':
              return (userStats?.points || 0) >= badge?.requirement;
            case 'rank':
              return (userStats?.rank || Infinity) <= badge?.requirement;
            default:
              return false;
          }
        });
        
        setUserBadges(earnedBadges);
      }
      
      setBadges(allBadges);
    } catch (err) {
      console.error('Failed to fetch badges:', err);
    } finally {
      setLoading(false);
    }
  };

  const BadgeCard = ({ badge, earned = false, progress = 0 }) => {
    return (
      <div className={`relative p-4 rounded-lg border transition-all duration-200 ${
        earned 
          ? 'bg-card border-primary shadow-lg' 
          : 'bg-muted/30 border-muted'
      }`}>
        <div className="flex items-start space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            earned ? badge?.color : 'bg-muted'
          }`}>
            <Icon 
              name={badge?.icon} 
              size={20} 
              className={earned ? 'text-white' : 'text-muted-foreground'} 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold ${
              earned ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {badge?.name}
            </h4>
            <p className={`text-sm mt-1 ${
              earned ? 'text-muted-foreground' : 'text-muted-foreground/70'
            }`}>
              {badge?.description}
            </p>
            
            {!earned && progress > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{Math.min(progress, badge?.requirement)}/{badge?.requirement}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((progress / badge?.requirement) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {earned && (
          <div className="absolute -top-2 -right-2">
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <Icon name="Check" size={14} className="text-white" />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array?.from({ length: preview ? 3 : 8 })?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="animate-pulse flex items-center space-x-3">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (preview) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Award" size={16} className="mr-2" />
          Achievement Badges
        </h3>
        <div className="space-y-3">
          {badges?.map((badge) => {
            const earned = userBadges?.some(ub => ub?.id === badge?.id);
            return (
              <BadgeCard
                key={badge?.id}
                badge={badge}
                earned={earned}
              />
            );
          })}
        </div>
        {!preview && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" size="sm" fullWidth>
              View All Badges
            </Button>
          </div>
        )}
      </div>
    );
  }

  const earnedCount = userBadges?.length || 0;
  const totalCount = badges?.length || 0;

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Your Achievements
          </h2>
          <span className="text-sm text-muted-foreground">
            {earnedCount}/{totalCount} earned
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` 
            }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Keep participating to unlock more achievements!
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {badges?.map((badge) => {
          const earned = userBadges?.some(ub => ub?.id === badge?.id);
          // Calculate progress for non-earned badges
          let progress = 0;
          if (!earned && user) {
            // This would need to be calculated based on actual user stats
            // For now, showing placeholder progress
            progress = Math.floor(Math.random() * badge?.requirement);
          }
          
          return (
            <BadgeCard
              key={badge?.id}
              badge={badge}
              earned={earned}
              progress={progress}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AchievementBadges;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { questionService } from '../../services/questionService';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProfileHeader from './components/ProfileHeader';
import StatsOverview from './components/StatsOverview';
import ActivityTabs from './components/ActivityTabs';
import SettingsModal from './components/SettingsModal';
import EditProfileModal from './components/EditProfileModal';

const UserProfile = () => {
  const { user, userProfile, loading: authLoading, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userStats, setUserStats] = useState({
    questionsAsked: 0,
    answersGiven: 0,
    acceptedAnswers: 0,
    totalPoints: 0,
    rank: 0,
    badgesEarned: 3,
    weeklyGrowth: 0,
    profileCompletion: 85
  });

  // Fetch user's questions and answers
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        
        // Fetch user's questions
        const { data: questions } = await questionService?.getQuestions({
          userId: user?.id,
          limit: 50
        });
        setUserQuestions(questions || []);

        // Fetch user's answers (if you have this service method)
        // const { data: answers } = await questionService?.getUserAnswers?.(user?.id);
        // setUserAnswers(answers || []);

        // Update stats based on fetched data
        setUserStats(prev => ({
          ...prev,
          questionsAsked: questions?.length || 0,
          totalPoints: userProfile?.points || 0,
          rank: userProfile?.rank || 0,
          weeklyGrowth: userProfile?.weekly_growth || 0
        }));

      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id, userProfile]);

  const handleProfileUpdate = async (updatedData) => {
    try {
      const { data, error } = await authService?.updateUserProfile(user?.id, updatedData);
      if (error) throw error;
      
      await refreshProfile?.();
      setShowEditProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Icon name="User" size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to view your profile</h2>
            <p className="text-muted-foreground mb-6">
              Access your questions, answers, achievements, and manage your account settings.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <a href="/student-login">Sign In</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/user-registration">Create Account</a>
              </Button>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile - UC DoubtClear</title>
        <meta name="description" content="Manage your UC DoubtClear profile, view your activity, achievements, and account settings." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
          {/* Profile Header */}
          <ProfileHeader
            user={userProfile}
            stats={userStats}
            onEditProfile={() => setShowEditProfile(true)}
            onSettings={() => setShowSettings(true)}
          />

          {/* Stats Overview - Mobile */}
          <div className="lg:hidden mb-6">
            <StatsOverview stats={userStats} />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Stats Sidebar */}
            <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
              <div className="sticky top-32 space-y-6">
                <StatsOverview stats={userStats} />
                
                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      iconName="Plus"
                      asChild
                    >
                      <a href="/ask-question">Ask a Question</a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      iconName="Search"
                      asChild
                    >
                      <a href="/browse-questions">Browse Questions</a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      iconName="Settings"
                      onClick={() => setShowSettings(true)}
                    >
                      Account Settings
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <ActivityTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                userQuestions={userQuestions}
                userAnswers={userAnswers}
                userStats={userStats}
                loading={loading}
              />
            </div>
          </div>
        </main>

        {/* Modals */}
        {showEditProfile && (
          <EditProfileModal
            user={userProfile}
            onClose={() => setShowEditProfile(false)}
            onSave={handleProfileUpdate}
          />
        )}

        {showSettings && (
          <SettingsModal
            user={userProfile}
            onClose={() => setShowSettings(false)}
          />
        )}

        <BottomNavigation />
      </div>
    </>
  );
};

export default UserProfile;
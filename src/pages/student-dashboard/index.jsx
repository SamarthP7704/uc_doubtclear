import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import StatsCard from './components/StatsCard';
import RecentQuestionsCard from './components/RecentQuestionsCard';
import BookmarkedQuestionsCard from './components/BookmarkedQuestionsCard';
import TrendingQuestionsCard from './components/TrendingQuestionsCard';
import QuickActionsCard from './components/QuickActionsCard';
import LeaderboardCard from './components/LeaderboardCard';
import ActivityFeedCard from './components/ActivityFeedCard';
import Icon from '../../components/AppIcon';

const StudentDashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const formatLastUpdated = (date) => {
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show preview mode for non-authenticated users (Rocket development mode)
  const isPreviewMode = !user;
  const displayName = userProfile?.full_name || user?.user_metadata?.full_name || 'Student';

  return (
    <>
      <Helmet>
        <title>Dashboard - UC DoubtClear</title>
        <meta name="description" content="Your personalized academic Q&A dashboard with stats, recent questions, and trending discussions." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Preview Mode Banner */}
        {isPreviewMode && (
          <div className="bg-blue-50 border-b border-blue-200 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <Icon name="Eye" size={16} />
                <span className="text-sm font-medium">
                  Preview Mode - 
                  <button 
                    onClick={() => window.location.href = '/student-login'}
                    className="ml-1 underline hover:no-underline"
                  >
                    Sign in
                  </button>
                  {' '}to access your personal dashboard
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Pull to refresh indicator */}
        {isRefreshing && (
          <div className="bg-primary/10 border-b border-primary/20 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Icon name="RefreshCw" size={16} className="animate-spin" />
                <span className="text-sm font-medium">Refreshing...</span>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome back, {displayName?.split(' ')?.[0]}!
                  {isPreviewMode && <span className="text-sm font-normal text-muted-foreground ml-2">(Preview)</span>}
                </h1>
                <p className="text-muted-foreground">
                  {isPreviewMode 
                    ? 'This is a preview of your dashboard. Sign in to see your actual data.' :'Ready to learn something new today?'
                  }
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                aria-label="Refresh dashboard"
              >
                <Icon 
                  name="RefreshCw" 
                  size={20} 
                  className={`text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {formatLastUpdated(lastUpdated)}
            </p>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            <StatsCard />
            <QuickActionsCard />
            <RecentQuestionsCard />
            <TrendingQuestionsCard />
            <BookmarkedQuestionsCard />
            <ActivityFeedCard />
            <LeaderboardCard currentUser={userProfile} />
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              <StatsCard />
              <QuickActionsCard />
              <LeaderboardCard currentUser={userProfile} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-6 space-y-6">
              <RecentQuestionsCard />
              <TrendingQuestionsCard />
              <ActivityFeedCard />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              <BookmarkedQuestionsCard />
              
              {/* Course Progress Card */}
              <div className="bg-card rounded-lg border border-border p-4 shadow-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Your Courses</h2>
                {isPreviewMode ? (
                  <div className="space-y-3">
                    {['CS 2028', 'MATH 2076', 'PHYS 2001']?.map((course, index) => (
                      <div key={course} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <span className="text-sm font-medium text-foreground">{course}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-xs text-muted-foreground">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Icon name="BookOpen" size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No courses enrolled yet
                    </p>
                    <button 
                      onClick={() => window.location.href = '/courses'}
                      className="text-sm text-primary hover:text-primary/80 font-medium mt-2"
                    >
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <BottomNavigation />
        <FloatingActionButton />
      </div>
    </>
  );
};

export default StudentDashboard;
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import LeaderboardTabs from './components/LeaderboardTabs';
import UserRankCard from './components/UserRankCard';
import CurrentUserStats from './components/CurrentUserStats';
import AchievementBadges from './components/AchievementBadges';

const Leaderboard = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overall');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  const periods = [
    { value: 'all', label: 'All Time' },
    { value: 'monthly', label: 'This Month' },
    { value: 'weekly', label: 'This Week' },
    { value: 'daily', label: 'Today' }
  ];

  const tabs = [
    { id: 'overall', label: 'Overall Points', icon: 'Trophy' },
    { id: 'weekly', label: 'Weekly Leaders', icon: 'Calendar' },
    { id: 'courses', label: 'By Course', icon: 'BookOpen' },
    { id: 'achievements', label: 'Achievements', icon: 'Award' }
  ];

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }

      const filters = {
        period: selectedPeriod,
        courseId: selectedCourse || undefined,
        search: searchQuery || undefined,
        tab: activeTab,
        limit: 50
      };

      const { data, error: fetchError } = await userService?.getLeaderboard(filters);
      
      if (fetchError) {
        throw fetchError;
      }

      setUsers(data?.users || []);
      
      // Find current user's rank
      if (user && data?.users) {
        const userRank = data?.users?.findIndex(u => u?.id === user?.id);
        setCurrentUserRank(userRank >= 0 ? userRank + 1 : null);
      }
      
    } catch (err) {
      setError(err?.message || 'Failed to fetch leaderboard');
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, selectedPeriod, selectedCourse, searchQuery, user]);

  // Fetch courses for filter
  const fetchCourses = useCallback(async () => {
    try {
      const { data } = (await userService?.getCourses?.()) || { data: [] };
      setCourses(data || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchLeaderboard();
    fetchCourses();
  }, [fetchLeaderboard, fetchCourses]);

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeaderboard();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter changes
  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, selectedPeriod, selectedCourse]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard(false);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedPeriod('all');
    setSelectedCourse('');
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overall':
        return 'Overall Leaderboard';
      case 'weekly':
        return 'Weekly Leaders';
      case 'courses':
        return 'Course Rankings';
      case 'achievements':
        return 'Achievement Badges';
      default:
        return 'Leaderboard';
    }
  };

  const activeFiltersCount = [searchQuery, selectedCourse, selectedPeriod !== 'all' ? selectedPeriod : '']?.filter(Boolean)?.length;

  return (
    <>
      <Helmet>
        <title>Leaderboard - UC DoubtClear</title>
        <meta name="description" content="View student rankings, brownie points, and achievements in the UC DoubtClear community." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
          {/* Tabs */}
          <div className="mb-6">
            <LeaderboardTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Current User Stats - Mobile */}
          {user && userProfile && (
            <div className="lg:hidden mb-6">
              <CurrentUserStats
                user={userProfile}
                rank={currentUserRank}
                compact={true}
              />
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-80 lg:flex-shrink-0">
              <div className="space-y-6">
                {/* Desktop Current User Stats */}
                {user && userProfile && (
                  <div className="hidden lg:block">
                    <CurrentUserStats
                      user={userProfile}
                      rank={currentUserRank}
                    />
                  </div>
                )}

                {/* Filters */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Filters</h3>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs"
                      >
                        Clear ({activeFiltersCount})
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Search Users
                      </label>
                      <Input
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e?.target?.value)}
                        iconName="Search"
                      />
                    </div>

                    {/* Time Period */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Time Period
                      </label>
                      <Select
                        value={selectedPeriod}
                        onChange={setSelectedPeriod}
                        options={periods}
                      />
                    </div>

                    {/* Course Filter */}
                    {activeTab === 'courses' && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Course
                        </label>
                        <Select
                          value={selectedCourse}
                          onChange={setSelectedCourse}
                          options={[
                            { value: '', label: 'All Courses' },
                            ...(courses?.map(course => ({
                              value: course?.id,
                              label: `${course?.code} - ${course?.name}`
                            })) || [])
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Achievement Badges Preview */}
                {activeTab !== 'achievements' && (
                  <div className="hidden lg:block">
                    <AchievementBadges preview={true} />
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-foreground">
                    {getTabTitle()}
                  </h1>
                  {users?.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {users?.length} user{users?.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  loading={refreshing}
                  iconName="RefreshCw"
                >
                  Refresh
                </Button>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} className="text-destructive" />
                    <p className="text-destructive font-medium">Error loading leaderboard</p>
                  </div>
                  <p className="text-destructive/80 text-sm mt-1">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchLeaderboard()}
                    className="mt-3"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="space-y-4">
                  {Array?.from({ length: 8 })?.map((_, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-4">
                      <div className="animate-pulse flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="h-8 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Achievement View */}
              {activeTab === 'achievements' && !loading && (
                <AchievementBadges />
              )}

              {/* Leaderboard List */}
              {activeTab !== 'achievements' && !loading && (
                <>
                  {users?.length > 0 ? (
                    <div className="space-y-3">
                      {users?.map((user, index) => (
                        <UserRankCard
                          key={user?.id || index}
                          user={user}
                          rank={index + 1}
                          period={selectedPeriod}
                          isCurrentUser={user?.id === user?.id}
                          showCourse={activeTab === 'courses'}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="Users" size={64} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No users found
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        {searchQuery || selectedCourse
                          ? 'Try adjusting your search criteria or filters.' : 'Be the first to earn brownie points in this community!'
                        }
                      </p>
                      {(searchQuery || selectedCourse) && (
                        <Button
                          variant="outline"
                          onClick={handleClearFilters}
                          iconName="X"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        <BottomNavigation />
      </div>
    </>
  );
};

export default Leaderboard;
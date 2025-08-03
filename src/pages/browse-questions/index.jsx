import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { questionService } from '../../services/questionService';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';
import QuestionCard from './components/QuestionCard';
import QuestionSkeleton from './components/QuestionSkeleton';

const BrowseQuestions = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState([]);

  // Fetch questions based on current filters
  const fetchQuestions = useCallback(async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      }

      const filters = {
        limit: 20,
        offset: isLoadMore ? (page - 1) * 20 : 0,
        courseId: selectedCourse || undefined,
        status: selectedStatus || undefined,
        search: searchQuery || undefined,
        sortBy: sortBy
      };

      const { data, error: fetchError } = await questionService?.getQuestions(filters);
      
      if (fetchError) {
        throw fetchError;
      }

      if (isLoadMore) {
        setQuestions(prev => [...prev, ...(data || [])]);
      } else {
        setQuestions(data || []);
      }

      setHasMore((data?.length || 0) === 20);
      
    } catch (err) {
      setError(err?.message || 'Failed to fetch questions');
      if (!isLoadMore) {
        setQuestions([]);
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCourse, selectedStatus, sortBy]);

  // Fetch courses for filter options
  const fetchCourses = useCallback(async () => {
    try {
      const { data } = (await questionService?.getCourses?.()) || { data: [] };
      setCourses(data || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchQuestions();
    fetchCourses();
  }, [fetchQuestions, fetchCourses]);

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      fetchQuestions();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter changes
  useEffect(() => {
    setPage(1);
    fetchQuestions();
  }, [selectedCourse, selectedStatus, sortBy]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchQuestions(true);
  };

  const handleBookmark = async (questionId) => {
    if (!user) return;
    
    try {
      await questionService?.toggleBookmark(user?.id, questionId);
      // Update the question in the list
      setQuestions(prev => prev?.map(q => 
        q?.id === questionId 
          ? { ...q, isBookmarked: !q?.isBookmarked }
          : q
      ));
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCourse('');
    setSelectedStatus('');
    setSortBy('recent');
    setPage(1);
  };

  const activeFiltersCount = [searchQuery, selectedCourse, selectedStatus]?.filter(Boolean)?.length;

  return (
    <>
      <Helmet>
        <title>Browse Questions - UC DoubtClear</title>
        <meta name="description" content="Discover academic questions across all UC courses. Search, filter, and find answers to help with your studies." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />

        {/* Search Bar - Always visible */}
        <div className="sticky top-[128px] md:top-[112px] z-50 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search questions, topics, keywords..."
            />
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
              <div className="sticky top-32">
                <FilterSidebar
                  courses={courses}
                  selectedCourse={selectedCourse}
                  onCourseChange={setSelectedCourse}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onClearFilters={handleClearFilters}
                  activeFiltersCount={activeFiltersCount}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-semibold text-foreground">
                    Browse Questions
                  </h1>
                  {activeFiltersCount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  iconName="Filter"
                >
                  Filters
                </Button>
              </div>

              {/* Mobile Filter Panel */}
              {showFilters && (
                <div className="lg:hidden mb-6 bg-card border border-border rounded-lg p-4">
                  <FilterSidebar
                    courses={courses}
                    selectedCourse={selectedCourse}
                    onCourseChange={setSelectedCourse}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    onClearFilters={handleClearFilters}
                    activeFiltersCount={activeFiltersCount}
                    isMobile={true}
                  />
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      fullWidth
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {/* Desktop Header */}
                <div className="hidden lg:flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-foreground">
                      Browse Questions
                    </h1>
                    {questions?.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {questions?.length} question{questions?.length !== 1 ? 's' : ''} found
                      </span>
                    )}
                  </div>
                </div>

                {/* Error State */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={20} className="text-destructive" />
                      <p className="text-destructive font-medium">Error loading questions</p>
                    </div>
                    <p className="text-destructive/80 text-sm mt-1">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchQuestions()}
                      className="mt-3"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {/* Loading Skeletons */}
                {loading && questions?.length === 0 && (
                  <div className="space-y-4">
                    {Array?.from({ length: 6 })?.map((_, index) => (
                      <QuestionSkeleton key={index} />
                    ))}
                  </div>
                )}

                {/* Questions */}
                {questions?.length > 0 && (
                  <>
                    {questions?.map((question, index) => (
                      <QuestionCard
                        key={question?.id || index}
                        question={question}
                        onBookmark={handleBookmark}
                        isAuthenticated={!!user}
                      />
                    ))}

                    {/* Load More Button */}
                    {hasMore && !loading && (
                      <div className="text-center pt-6">
                        <Button
                          variant="outline"
                          onClick={handleLoadMore}
                          loading={loading}
                        >
                          Load More Questions
                        </Button>
                      </div>
                    )}

                    {/* Loading More Indicator */}
                    {loading && questions?.length > 0 && (
                      <div className="space-y-4">
                        {Array?.from({ length: 3 })?.map((_, index) => (
                          <QuestionSkeleton key={`loading-${index}`} />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Empty State */}
                {!loading && questions?.length === 0 && !error && (
                  <div className="text-center py-12">
                    <Icon name="Search" size={64} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No questions found
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {searchQuery || selectedCourse || selectedStatus
                        ? 'Try adjusting your search criteria or filters to find more questions.' :'Be the first to ask a question in this community!'
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {(searchQuery || selectedCourse || selectedStatus) && (
                        <Button
                          variant="outline"
                          onClick={handleClearFilters}
                          iconName="X"
                        >
                          Clear Filters
                        </Button>
                      )}
                      <Button
                        asChild
                        iconName="Plus"
                      >
                        <Link to="/ask-question">
                          Ask a Question
                        </Link>
                      </Button>
                    </div>
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

export default BrowseQuestions;
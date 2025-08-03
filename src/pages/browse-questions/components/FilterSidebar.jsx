import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';


const FilterSidebar = ({
  courses = [],
  selectedCourse,
  onCourseChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  onClearFilters,
  activeFiltersCount = 0,
  isMobile = false
}) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'answered', label: 'Answered' },
    { value: 'ai_assisted', label: 'AI Assisted' },
    { value: 'closed', label: 'Closed' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'answered', label: 'Recently Answered' }
  ];

  const courseOptions = [
    { value: '', label: 'All Courses' },
    ...courses?.map(course => ({
      value: course?.id,
      label: `${course?.code} - ${course?.name}`
    }))
  ];

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${isMobile ? '' : 'sticky top-4'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Sort By
          </label>
          <Select
            value={sortBy}
            onValueChange={onSortChange}
            options={sortOptions}
          />
        </div>

        {/* Course Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Course
          </label>
          <Select
            value={selectedCourse}
            onValueChange={onCourseChange}
            options={courseOptions}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <Select
            value={selectedStatus}
            onValueChange={onStatusChange}
            options={statusOptions}
          />
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Quick Filters
          </label>
          <div className="space-y-2">
            <Button
              variant={selectedStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange(selectedStatus === 'pending' ? '' : 'pending')}
              iconName="Clock"
              fullWidth
              className="justify-start"
            >
              Unanswered Questions
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange(sortBy === 'popular' ? 'recent' : 'popular')}
              iconName="TrendingUp"
              fullWidth
              className="justify-start"
            >
              Trending This Week
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center justify-between">
              <span>Active filters:</span>
              <span className="font-medium">{activeFiltersCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
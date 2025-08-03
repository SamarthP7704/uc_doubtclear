import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { questionService } from '../../../services/questionService';
import { userService } from '../../../services/userService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import AIAssistant from './AIAssistant';

const QuestionForm = ({ onSubmit, onSaveDraft, isDraftSaved, isSubmitting }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    courseId: '',
    isUrgent: false
  });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    loadCourses();
    loadDraftFromStorage();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoadingCourses(true);
      setError(''); // Clear any previous errors
      
      const { data, error } = await userService?.getAllCourses();
      
      if (error) {
        console.error('Course loading error:', error);
        setError('Unable to load courses. Please refresh the page or contact support if the issue persists.');
        setCourses([]);
        return;
      }
      
      // Check if courses array is empty
      if (!data || data?.length === 0) {
        setError('No courses are currently available. Please contact your administrator to set up courses.');
        setCourses([]);
        return;
      }
      
      // Transform courses data for Select component
      const formattedCourses = data?.map(course => ({
        value: course?.id,
        label: `${course?.code} - ${course?.name}`,
        description: course?.description
      }));
      
      setCourses(formattedCourses);
      
    } catch (error) {
      console.error('Course loading exception:', error);
      setError('Failed to connect to the server. Please check your internet connection and try again.');
      setCourses([]);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const loadDraftFromStorage = () => {
    try {
      const savedDraft = localStorage.getItem('questionDraft');
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setFormData(prev => ({
          ...prev,
          ...draft
        }));
      }
    } catch (error) {
      // Ignore error - draft loading is not critical
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Auto-save draft every few characters
    if ((name === 'title' || name === 'content') && newValue?.length > 5) {
      saveDraftToStorage({ ...formData, [name]: newValue });
    }
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      courseId: value
    }));
    
    // Clear error when user selects a course
    if (error) setError('');
    
    // Auto-save draft
    saveDraftToStorage({ ...formData, courseId: value });
  };

  const handleAISuggestion = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-save draft when AI suggestion is applied
    saveDraftToStorage({ ...formData, [field]: value });
  };

  const getCurrentCourse = () => {
    return courses?.find(course => course?.value === formData?.courseId)?.label || '';
  };

  const saveDraftToStorage = (data) => {
    try {
      localStorage.setItem('questionDraft', JSON.stringify(data));
    } catch (error) {
      // Ignore error - draft saving is not critical
    }
  };

  const handleSaveDraft = () => {
    saveDraftToStorage(formData);
    onSaveDraft?.(formData);
  };

  const validateForm = () => {
    if (!formData?.title?.trim()) {
      setError('Please enter a question title');
      return false;
    }
    
    if (formData?.title?.length < 10) {
      setError('Question title must be at least 10 characters long');
      return false;
    }
    
    if (!formData?.content?.trim()) {
      setError('Please describe your question in detail');
      return false;
    }
    
    if (formData?.content?.length < 20) {
      setError('Question description must be at least 20 characters long');
      return false;
    }
    
    if (!formData?.courseId) {
      if (courses?.length === 0) {
        setError('No courses are available. Please contact your administrator to set up courses before posting questions.');
      } else {
        setError('Please select a course');
      }
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!user) {
      setError('You must be signed in to ask a question');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setError('');

    try {
      const questionData = {
        user_id: user?.id,
        course_id: formData?.courseId,
        title: formData?.title?.trim(),
        content: formData?.content?.trim(),
        is_urgent: formData?.isUrgent
      };

      const { data, error } = await questionService?.createQuestion(questionData);
      
      if (error) {
        setError(error?.message || 'Failed to post question');
        return;
      }

      // Clear draft from storage on successful submission
      localStorage.removeItem('questionDraft');
      
      // Call parent submit handler
      onSubmit?.(data);
      
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const clearDraft = () => {
    setFormData({
      title: '',
      content: '',
      courseId: '',
      isUrgent: false
    });
    localStorage.removeItem('questionDraft');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Draft Saved Indicator */}
      {isDraftSaved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={16} />
            <span>Draft saved successfully!</span>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <AIAssistant
        title={formData?.title}
        content={formData?.content}
        course={getCurrentCourse()}
        onSuggestionApply={handleAISuggestion}
      />

      {/* Question Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-foreground">
          Question Title *
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          value={formData?.title || ''}
          onChange={handleInputChange}
          placeholder="What is your question? Be specific and clear..."
          disabled={isSubmitting}
          required
          className="w-full"
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground">
          {formData?.title?.length || 0}/200 characters • Minimum 10 characters
        </p>
      </div>
      {/* Course Selection */}
      <div className="space-y-2">
        <label htmlFor="courseId" className="block text-sm font-medium text-foreground">
          Course *
        </label>
        <div className="relative">
          <Select
            id="courseId"
            name="courseId"
            value={formData?.courseId || ''}
            onChange={handleSelectChange}
            options={courses}
            disabled={isSubmitting || isLoadingCourses}
            required
            loading={isLoadingCourses}
            placeholder={
              isLoadingCourses 
                ? 'Loading courses...' 
                : courses?.length === 0 
                  ? 'No courses available' :'Select a course'
            }
            className="w-full"
            searchable={courses?.length > 5}
            clearable={false}
          />
          {(isLoadingCourses || (courses?.length === 0 && !isLoadingCourses)) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isLoadingCourses ? (
                <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
              ) : courses?.length === 0 ? (
                <button
                  type="button"
                  onClick={loadCourses}
                  className="text-primary hover:text-primary/80 p-1"
                  title="Retry loading courses"
                >
                  <Icon name="RefreshCw" size={16} />
                </button>
              ) : null}
            </div>
          )}
        </div>
        
        {/* Enhanced course loading feedback */}
        {!isLoadingCourses && courses?.length === 0 && !error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-sm">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">No courses available</p>
                <p className="text-xs">
                  Contact your instructor or administrator to set up courses, or{' '}
                  <button
                    type="button"
                    onClick={loadCourses}
                    className="underline hover:no-underline font-medium"
                  >
                    try refreshing
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Course loading error with retry option */}
        {!isLoadingCourses && error && error?.includes('load courses') && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-medium">Failed to load courses</p>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={loadCourses}
                    className="inline-flex items-center space-x-1 text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded transition-colors"
                  >
                    <Icon name="RefreshCw" size={12} />
                    <span>Retry</span>
                  </button>
                  <span className="text-xs text-red-600">
                    Check your internet connection
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Question Content */}
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-foreground">
          Describe Your Question *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData?.content || ''}
          onChange={handleInputChange}
          placeholder="Provide detailed context, what you've tried, specific examples, and what kind of help you need...

Tip: The AI assistant above can help improve your question for better responses!"
          disabled={isSubmitting}
          required
          rows={8}
          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y min-h-[200px]"
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground">
          {formData?.content?.length || 0}/2000 characters • Minimum 20 characters
        </p>
      </div>
      {/* Urgent Checkbox */}
      <div className="flex items-start space-x-3">
        <input
          id="isUrgent"
          name="isUrgent"
          type="checkbox"
          checked={formData?.isUrgent || false}
          onChange={handleInputChange}
          className="mt-1 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
          disabled={isSubmitting}
        />
        <div>
          <label htmlFor="isUrgent" className="text-sm font-medium text-foreground">
            Mark as Urgent
          </label>
          <p className="text-xs text-muted-foreground">
            Only use for time-sensitive questions (assignments due soon, exam prep, etc.)
          </p>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting || !user || courses?.length === 0}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Posting Question...</span>
            </div>
          ) : courses?.length === 0 ? (
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} />
              <span>No Courses Available</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Icon name="Send" size={16} />
              <span>Post Question</span>
            </div>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting || !formData?.title?.trim()}
          className="sm:w-auto"
        >
          <div className="flex items-center space-x-2">
            <Icon name="Save" size={16} />
            <span>Save Draft</span>
          </div>
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={clearDraft}
          disabled={isSubmitting}
          className="sm:w-auto"
        >
          <div className="flex items-center space-x-2">
            <Icon name="X" size={16} />
            <span>Clear</span>
          </div>
        </Button>
      </div>
      {/* Sign In Reminder */}
      {!user && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} />
            <span>
              You need to{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/student-login'}
                className="font-medium underline hover:no-underline"
              >
                sign in
              </button>
              {' '}to post questions.
            </span>
          </div>
        </div>
      )}
    </form>
  );
};

export default QuestionForm;
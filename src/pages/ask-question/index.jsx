import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import QuestionForm from './components/QuestionForm';
import PostingGuidelines from './components/PostingGuidelines';
import SimilarQuestions from './components/SimilarQuestions';
import CommunityTips from './components/CommunityTips';

const AskQuestion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFormData, setCurrentFormData] = useState({
    title: '',
    course: ''
  });

  const handleSubmit = async (questionData) => {
    setIsSubmitting(true);
    
    try {
      // Navigation after successful submission will be handled by QuestionForm
      navigate('/student-dashboard', { 
        state: { 
          message: 'Your question has been posted successfully!',
          questionId: questionData?.id
        }
      });
    } catch (error) {
      console.error('Error in question submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (formData) => {
    // Save to localStorage (already handled in QuestionForm)
    setIsDraftSaved(true);
    setCurrentFormData(formData);
    
    // Reset draft saved indicator after 3 seconds
    setTimeout(() => {
      setIsDraftSaved(false);
    }, 3000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border sticky top-16 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            aria-label="Go back"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Ask Question</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  aria-label="Go back"
                >
                  <Icon name="ArrowLeft" size={20} />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Ask a Question</h1>
                  <p className="text-muted-foreground">
                    Get help from your UC peers and AI assistance
                  </p>
                </div>
              </div>
            </div>

            {/* Question Form */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6 lg:mb-0">
              <QuestionForm
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                isDraftSaved={isDraftSaved}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Mobile Guidelines */}
            <div className="lg:hidden mt-6">
              <PostingGuidelines />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-6 lg:mt-0 space-y-6">
            {/* Desktop Guidelines */}
            <div className="hidden lg:block">
              <PostingGuidelines />
            </div>

            {/* Similar Questions */}
            <SimilarQuestions 
              currentTitle={currentFormData?.title}
              currentCourse={currentFormData?.course}
            />

            {/* Community Tips */}
            <CommunityTips />

            {/* Help Section */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="HelpCircle" size={20} className="text-primary" />
                <h3 className="font-medium text-foreground">Need Help?</h3>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-2">
                    <Icon name="Book" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">How to ask good questions</span>
                  </div>
                </button>
                
                <button className="w-full text-left p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-2">
                    <Icon name="MessageCircle" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">Community guidelines</span>
                  </div>
                </button>
                
                <button className="w-full text-left p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-2">
                    <Icon name="Mail" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">Contact support</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Bottom Padding */}
      <div className="h-20 lg:hidden" />
    </div>
  );
};

export default AskQuestion;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { questionService } from '../../services/questionService';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import QuestionPreview from './components/QuestionPreview';
import RichTextEditor from './components/RichTextEditor';
import ResourcesSidebar from './components/ResourcesSidebar';
import AIAnswerGenerator from './components/AIAnswerGenerator';
import BottomNavigation from '../../components/ui/BottomNavigation';


const AnswerQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResources, setShowResources] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/student-login');
      return;
    }

    if (!questionId) {
      navigate('/browse-questions');
      return;
    }

    loadQuestion();
    loadDraft();
  }, [questionId, user]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (answerContent?.trim()) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [answerContent]);

  const loadQuestion = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await questionService?.getQuestionById(questionId);
      
      if (error) {
        setError('Failed to load question');
        return;
      }
      
      if (!data) {
        setError('Question not found');
        return;
      }
      
      setQuestion(data);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDraft = () => {
    const draftKey = `answer_draft_${questionId}`;
    const savedDraft = localStorage?.getItem(draftKey);
    if (savedDraft) {
      setAnswerContent(savedDraft);
    }
  };

  const clearDraft = () => {
    const draftKey = `answer_draft_${questionId}`;
    localStorage?.removeItem(draftKey);
  };

  const saveDraft = () => {
    if (!answerContent?.trim()) return;
    
    const draftKey = `answer_draft_${questionId}`;
    localStorage?.setItem(draftKey, answerContent);
    setIsDraftSaved(true);
    
    setTimeout(() => setIsDraftSaved(false), 2000);
  };

  const saveDraftToStorage = (text) => {
    const draftKey = `answer_draft_${questionId}`;
    localStorage?.setItem(draftKey, text);
  };

  const handleSaveDraft = () => {
    saveDraftToStorage(answerContent);
  };

  const handleAIAnswerGenerated = (generatedAnswer) => {
    // Add AI-generated content to existing answer
    const newContent = answerContent 
      ? `${answerContent}\n\n---\n\n${generatedAnswer}`
      : generatedAnswer;
    
    setAnswerContent(newContent);
    saveDraftToStorage(newContent);
  };

  const handleAnswerChange = (value) => {
    setAnswerContent(value);
  };

  const handleSubmit = async () => {
    if (!answerContent?.trim()) {
      setError('Please provide an answer');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error } = await questionService?.createAnswer({
        content: answerContent,
        question_id: questionId,
        user_id: user?.id
      });
      
      if (error) {
        throw new Error(error?.message || 'Failed to submit answer');
      }
      
      clearDraft();
      
      // Navigate to question details with success message
      navigate(`/questions/${questionId}`, {
        state: { answerId: data?.id, success: 'Answer submitted successfully!' }
      });
      
    } catch (err) {
      setError(err?.message || 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (answerContent?.trim()) {
      const confirmed = window?.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    
    navigate(`/questions/${questionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-muted rounded mb-6"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Icon name="AlertCircle" size={64} className="mx-auto text-error mb-4" />
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              {error}
            </h1>
            <Button
              onClick={() => navigate('/browse-questions')}
              variant="outline"
            >
              ← Back to Browse Questions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-foreground">
                  Answer Question
                </h1>
                <div className="flex items-center space-x-2">
                  {isDraftSaved && (
                    <span className="text-sm text-success flex items-center">
                      <Icon name="Check" size={16} className="mr-1" />
                      Draft saved
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResources(!showResources)}
                    className="lg:hidden"
                  >
                    <Icon name="HelpCircle" size={16} />
                  </Button>
                </div>
              </div>

              {/* Question Preview */}
              <QuestionPreview question={question} />
            </div>

            {/* AI Answer Generator */}
            <AIAnswerGenerator 
              question={question}
              onGeneratedAnswer={handleAIAnswerGenerated}
            />

            {/* Answer Editor */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Your Answer
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    {answerContent?.length} words
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowPreview(false)}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                        !showPreview
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Icon name="Edit" size={16} />
                        <span>Write</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPreview(true)}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                        showPreview
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Icon name="Eye" size={16} />
                        <span>Preview</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Editor Tabs */}
              <div className="flex space-x-1 mb-4 bg-muted p-1 rounded">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    !showPreview
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="Edit" size={16} />
                    <span>Write</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    showPreview
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="Eye" size={16} />
                    <span>Preview</span>
                  </div>
                </button>
              </div>

              {/* Rich Text Editor */}
              <RichTextEditor
                value={answerContent}
                onChange={setAnswerContent}
                preview={showPreview}
                onSaveDraft={handleSaveDraft}
              />

              {/* Error Display */}
              {error && (
                <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-destructive" />
                    <span className="text-destructive text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={saveDraft}
                    disabled={!answerContent?.trim()}
                  >
                    <Icon name="Save" size={16} className="mr-1" />
                    Save Draft
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!answerContent?.trim()}
                    iconName="Send"
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-32">
              <ResourcesSidebar />
            </div>
          </aside>
        </div>

        {/* Mobile Resources Panel */}
        {showResources && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 right-0 w-80 bg-card border-l border-border">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">
                  Answer Guidelines
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowResources(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              <div className="p-4">
                <ResourcesSidebar />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-navigation">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default AnswerQuestion;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnswerForm = ({ onSubmit, onCancel, loading = false }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!content?.trim()) {
      setError('Please enter your answer');
      return;
    }

    if (content?.trim()?.length < 10) {
      setError('Answer must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onSubmit({ content: content?.trim() });
      
      if (result?.error) {
        setError(result?.error);
      } else {
        setContent('');
        // Form will be hidden by parent component on success
      }
    } catch (err) {
      setError('Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Write Your Answer
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <Icon name="X" size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e?.target?.value)}
            placeholder="Share your knowledge and help your fellow students..."
            className="w-full min-h-[200px] p-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-muted-foreground">
              {content?.length} characters (minimum 10)
            </div>
            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-muted-foreground"
              disabled={isSubmitting}
            >
              <Icon name="Paperclip" size={16} className="mr-2" />
              Attach File
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-muted-foreground"
              disabled={isSubmitting}
            >
              <Icon name="Code" size={16} className="mr-2" />
              Code Block
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting || !content?.trim() || content?.trim()?.length < 10}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Submit Answer
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Tips for writing great answers:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Be clear and concise in your explanations</li>
              <li>Include examples or step-by-step solutions when helpful</li>
              <li>Cite sources if you reference external materials</li>
              <li>Use proper formatting for code snippets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerForm;
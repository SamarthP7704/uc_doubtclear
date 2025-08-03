import { useState, useEffect, useCallback } from 'react';
import { questionService } from '../services/questionService';

/**
 * Hook to manage AI fallback functionality
 * Provides manual and automatic AI answer generation
 */
export const useAIFallback = () => {
  const [processing, setProcessing] = useState(false);
  const [lastProcessed, setLastProcessed] = useState(null);
  const [stats, setStats] = useState({
    processed: 0,
    errors: []
  });

  // Process AI fallbacks manually
  const processAIFallbacks = useCallback(async () => {
    if (processing) return;
    
    try {
      setProcessing(true);
      const results = await questionService?.processAIFallbacks();
      
      setStats(results);
      setLastProcessed(new Date());
      
      return results;
    } catch (error) {
      console.error('Failed to process AI fallbacks:', error);
      setStats({
        processed: 0,
        errors: [{ error: error?.message || 'Unknown error' }]
      });
    } finally {
      setProcessing(false);
    }
  }, [processing]);

  // Generate AI answer for specific question
  const generateAIAnswerForQuestion = useCallback(async (questionId) => {
    try {
      setProcessing(true);
      const result = await questionService?.generateAIAnswer(questionId);
      
      if (result?.error) {
        throw new Error(result?.error?.message);
      }
      
      return result?.data;
    } catch (error) {
      console.error('Failed to generate AI answer:', error);
      throw error;
    } finally {
      setProcessing(false);
    }
  }, []);

  // Auto-process AI fallbacks on interval (for development/testing)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!processing) {
        processAIFallbacks();
      }
    }, 60000); // Check every minute for demo purposes (adjust as needed)

    return () => clearInterval(interval);
  }, [processing, processAIFallbacks]);

  return {
    processing,
    stats,
    lastProcessed,
    processAIFallbacks,
    generateAIAnswerForQuestion
  };
};
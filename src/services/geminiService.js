import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini AI Service for UC DoubtClear
 * Provides AI-powered assistance for student questions and answers
 */
class GeminiService {
  constructor() {
    this.apiKey = import.meta.env?.VITE_GEMINI_API_KEY;
    this.genAI = null;
    this.model = null;
    this.initialized = false;
    this.initializationError = null;
    this.initialize();
  }

  initialize() {
    if (!this.apiKey || this.apiKey === 'your-gemini-api-key-here') {
      console.warn('Gemini API key not configured. AI features will be disabled.');
      this.initialized = false;
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.initialized = true;
      this.initializationError = null;
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      this.initialized = false;
      this.initializationError = error;
      // Don't throw error - just log it and continue
    }
  }

  isConfigured() {
    return this.initialized && this.genAI && this.model && this.apiKey && this.apiKey !== 'your-gemini-api-key-here';
  }

  /**
   * Generates AI-powered question suggestions
   * @param {string} title - The question title
   * @param {string} content - The question content
   * @param {string} course - The course name
   * @returns {Promise<object>} Suggestions and improvements
   */
  async improveQuestion(title, content, course) {
    if (!this.isConfigured()) {
      throw new Error('Gemini AI is not configured or failed to initialize');
    }

    try {
      const prompt = `As an AI tutor for university students, help improve this question for better clarity and responses:

Course: ${course}
Title: ${title}
Content: ${content}

Please provide:
1. A clearer, more specific title if needed
2. Suggestions to improve the question content
3. Missing context that would help answerers
4. Key concepts this question relates to

Format your response as JSON with these keys: improvedTitle, suggestions, missingContext, relatedConcepts`;

      const result = await this.model?.generateContent(prompt);
      const response = await result?.response;
      const text = response?.text();
      
      try {
        return JSON.parse(text);
      } catch {
        // Fallback if JSON parsing fails
        return {
          improvedTitle: title,
          suggestions: [text],
          missingContext: [],
          relatedConcepts: []
        };
      }
    } catch (error) {
      console.error('Error improving question:', error);
      throw new Error('Failed to generate question improvements');
    }
  }

  /**
   * Generates AI answer for a question
   * @param {string} title - Question title
   * @param {string} content - Question content
   * @param {string} course - Course name
   * @returns {Promise<string>} AI-generated answer
   */
  async generateAnswer(title, content, course) {
    if (!this.isConfigured()) {
      throw new Error('Gemini AI is not configured');
    }

    try {
      const prompt = `As an expert tutor for university students, provide a comprehensive answer to this question:

Course: ${course}
Question: ${title}
Details: ${content}

Please provide:
- A clear, step-by-step explanation
- Relevant examples when helpful
- Key concepts and formulas if applicable
- Additional resources or topics to explore

Keep your response educational and encourage further learning. Use markdown formatting for better readability.`;

      const result = await this.model?.generateContent(prompt);
      const response = await result?.response;
      return response?.text();
    } catch (error) {
      console.error('Error generating answer:', error);
      throw new Error('Failed to generate AI answer');
    }
  }

  /**
   * Streams AI answer generation for real-time display
   * @param {string} title - Question title
   * @param {string} content - Question content
   * @param {string} course - Course name
   * @param {Function} onChunk - Callback for each text chunk
   * @returns {Promise<void>}
   */
  async streamAnswer(title, content, course, onChunk) {
    if (!this.isConfigured()) {
      throw new Error('Gemini AI is not configured');
    }

    try {
      const prompt = `As an expert tutor for university students, provide a comprehensive answer to this question:

Course: ${course}
Question: ${title}
Details: ${content}

Please provide:
- A clear, step-by-step explanation
- Relevant examples when helpful
- Key concepts and formulas if applicable
- Additional resources or topics to explore

Keep your response educational and encourage further learning. Use markdown formatting for better readability.`;

      const result = await this.model?.generateContentStream(prompt);

      for await (const chunk of result?.stream) {
        const text = chunk?.text();
        if (text) {
          onChunk(text);
        }
      }
    } catch (error) {
      console.error('Error streaming answer:', error);
      throw new Error('Failed to stream AI answer');
    }
  }

  /**
   * Suggests similar questions based on the current question
   * @param {string} title - Question title
   * @param {string} course - Course name
   * @returns {Promise<Array>} Array of similar question suggestions
   */
  async suggestSimilarQuestions(title, course) {
    if (!this.isConfigured()) {
      throw new Error('Gemini AI is not configured');
    }

    try {
      const prompt = `Based on this question from a ${course} course: "${title}"

Generate 5 related questions that students might also ask. Make them specific and educational.

Format as JSON array with objects having 'title' and 'description' fields.`;

      const result = await this.model?.generateContent(prompt);
      const response = await result?.response;
      const text = response?.text();
      
      try {
        return JSON.parse(text);
      } catch {
        // Fallback to simple array
        return [
          { title: `What are the fundamentals of ${course}?`, description: 'Basic concepts overview' },
          { title: `How to solve ${course} problems step by step?`, description: 'Problem-solving methodology' }
        ];
      }
    } catch (error) {
      console.error('Error suggesting similar questions:', error);
      throw new Error('Failed to suggest similar questions');
    }
  }

  /**
   * Analyzes answer quality and provides feedback
   * @param {string} answer - The answer content
   * @param {string} question - The original question
   * @returns {Promise<object>} Analysis and feedback
   */
  async analyzeAnswerQuality(answer, question) {
    if (!this.isConfigured()) {
      throw new Error('Gemini AI is not configured');
    }

    try {
      const prompt = `Analyze this answer for quality and helpfulness:

Question: ${question}
Answer: ${answer}

Provide feedback as JSON with:
- clarity: number (1-10)
- completeness: number (1-10)
- accuracy: number (1-10)
- suggestions: array of improvement suggestions
- strengths: array of what the answer does well`;

      const result = await this.model?.generateContent(prompt);
      const response = await result?.response;
      const text = response?.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          clarity: 7,
          completeness: 7,
          accuracy: 8,
          suggestions: ['Consider adding more examples'],
          strengths: ['Clear explanation']
        };
      }
    } catch (error) {
      console.error('Error analyzing answer quality:', error);
      throw new Error('Failed to analyze answer quality');
    }
  }
}

export const geminiService = new GeminiService();
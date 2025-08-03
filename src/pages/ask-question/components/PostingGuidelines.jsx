import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PostingGuidelines = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const guidelines = [
    {
      id: 'clarity',
      title: 'Be Clear and Specific',
      icon: 'Target',
      content: `Write a descriptive title that summarizes your question\nInclude relevant course information and context\nExplain what you've already tried or researched\nBe specific about what you're struggling with`,
      tips: [
        'Use proper grammar and spelling',
        'Include relevant code, formulas, or examples',
        'Mention your current understanding level'
      ]
    },
    {
      id: 'research',
      title: 'Show Your Work',
      icon: 'BookOpen',
      content: `Demonstrate that you've made an effort to solve the problem\nMention resources you've already consulted\nExplain your thought process and where you got stuck\nInclude any partial solutions or attempts`,
      tips: [
        'Reference textbook sections or lecture notes',
        'Show calculations or reasoning steps',
        'Explain what confused you specifically'
      ]
    },
    {
      id: 'formatting',
      title: 'Format for Readability',
      icon: 'Type',
      content: `Use proper formatting for code, equations, and formulas\nBreak up long text into paragraphs\nUse bullet points or numbered lists when appropriate\nInclude relevant images or diagrams if helpful`,
      tips: [
        'Use code blocks for programming questions',
        'Format mathematical expressions clearly',
        'Keep paragraphs concise and focused'
      ]
    },
    {
      id: 'respect',
      title: 'Be Respectful and Patient',
      icon: 'Heart',
      content: `Remember that helpers are volunteers\nBe patient while waiting for responses\nThank those who help you\nFollow up with what worked or didn't work`,
      tips: [
        'Use polite language and tone','Acknowledge helpful responses','Share your solution if you figure it out'
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="HelpCircle" size={20} className="text-primary" />
        <h3 className="font-medium text-foreground">Posting Guidelines</h3>
      </div>
      <div className="space-y-3">
        {guidelines?.map((guideline) => (
          <div key={guideline?.id} className="border border-border rounded-lg">
            <button
              onClick={() => toggleSection(guideline?.id)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Icon name={guideline?.icon} size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{guideline?.title}</span>
              </div>
              <Icon 
                name={expandedSection === guideline?.id ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-muted-foreground" 
              />
            </button>
            
            {expandedSection === guideline?.id && (
              <div className="px-3 pb-3 space-y-3">
                <p className="text-xs text-muted-foreground whitespace-pre-line">
                  {guideline?.content}
                </p>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">Quick Tips:</p>
                  <ul className="space-y-1">
                    {guideline?.tips?.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Icon name="Check" size={12} className="text-success mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-primary mb-1">Pro Tip</p>
            <p className="text-xs text-primary/80">
              Questions that follow these guidelines typically receive faster and more helpful responses from the community!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostingGuidelines;
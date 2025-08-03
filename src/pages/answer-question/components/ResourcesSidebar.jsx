import React from 'react';
import Icon from '../../../components/AppIcon';

const ResourcesSidebar = () => {
  const guidelines = [
    {
      title: "Be Comprehensive",
      description: "Provide detailed explanations that address all aspects of the question.",
      icon: "BookOpen"
    },
    {
      title: "Show Your Work",
      description: "Include step-by-step solutions and reasoning behind your answer.",
      icon: "Calculator"
    },
    {
      title: "Use Examples",
      description: "Illustrate concepts with relevant examples or analogies.",
      icon: "Lightbulb"
    },
    {
      title: "Cite Sources",
      description: "Reference textbooks, papers, or reliable sources when applicable.",
      icon: "Link"
    },
    {
      title: "Format Properly",
      description: "Use code blocks, formulas, and formatting to improve readability.",
      icon: "FileText"
    }
  ];

  const tips = [
    "Start with a brief summary of your approach",
    "Break complex problems into smaller steps",
    "Explain your reasoning, not just the solution",
    "Consider alternative approaches or edge cases",
    "End with a clear conclusion or verification"
  ];

  const formattingExamples = [
    { label: "Bold text", syntax: "**bold text**" },
    { label: "Italic text", syntax: "*italic text*" },
    { label: "Inline code", syntax: "`code`" },
    { label: "Code block", syntax: "```\ncode block\n```" },
    { label: "Math formula", syntax: "$$E = mc^2$$" },
    { label: "Link", syntax: "[text](url)" }
  ];

  return (
    <div className="space-y-6">
      {/* Answer Guidelines */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Target" size={16} className="mr-2" />
          Answer Guidelines
        </h3>
        <div className="space-y-3">
          {guidelines?.map((guideline, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Icon 
                name={guideline?.icon} 
                size={16} 
                className="text-primary mt-0.5 flex-shrink-0" 
              />
              <div>
                <h4 className="font-medium text-foreground text-sm">
                  {guideline?.title}
                </h4>
                <p className="text-muted-foreground text-xs">
                  {guideline?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Tips */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Star" size={16} className="mr-2" />
          Quality Tips
        </h3>
        <ul className="space-y-2">
          {tips?.map((tip, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Formatting Help */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Type" size={16} className="mr-2" />
          Formatting
        </h3>
        <div className="space-y-2">
          {formattingExamples?.map((example, index) => (
            <div key={index} className="text-xs">
              <div className="font-medium text-foreground mb-1">
                {example?.label}
              </div>
              <code className="bg-muted px-2 py-1 rounded text-muted-foreground">
                {example?.syntax}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Scoring Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h3 className="font-semibold text-primary mb-2 flex items-center">
          <Icon name="Award" size={16} className="mr-2" />
          Earn Brownie Points
        </h3>
        <div className="text-xs text-primary/80 space-y-1">
          <div className="flex justify-between">
            <span>Answer submitted:</span>
            <span className="font-medium">+5 points</span>
          </div>
          <div className="flex justify-between">
            <span>Answer upvoted:</span>
            <span className="font-medium">+3 points</span>
          </div>
          <div className="flex justify-between">
            <span>Answer accepted:</span>
            <span className="font-medium">+10 points</span>
          </div>
          <div className="flex justify-between">
            <span>High-quality answer:</span>
            <span className="font-medium">+2 bonus</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesSidebar;
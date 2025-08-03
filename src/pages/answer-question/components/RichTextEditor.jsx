import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RichTextEditor = ({ value, onChange, preview, onSaveDraft }) => {
  const textareaRef = useRef(null);
  const [selectedText, setSelectedText] = useState('');

  const insertText = (before, after = '', placeholder = '') => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;
    const selectedText = value?.substring(start, end) || placeholder;
    
    const newText = value?.substring(0, start) + before + selectedText + after + value?.substring(end);
    onChange?.(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      const newPosition = start + before?.length + selectedText?.length + after?.length;
      textarea?.setSelectionRange(newPosition, newPosition);
      textarea?.focus();
    }, 0);
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + S to save draft
    if ((e?.ctrlKey || e?.metaKey) && e?.key === 's') {
      e?.preventDefault();
      onSaveDraft?.();
    }

    // Tab key for indentation
    if (e?.key === 'Tab') {
      e?.preventDefault();
      insertText('    '); // 4 spaces for indentation
    }
  };

  const toolbarButtons = [
    { 
      icon: 'Bold', 
      label: 'Bold', 
      action: () => insertText('**', '**', 'bold text'),
      shortcut: 'Ctrl+B'
    },
    { 
      icon: 'Italic', 
      label: 'Italic', 
      action: () => insertText('*', '*', 'italic text'),
      shortcut: 'Ctrl+I'
    },
    { 
      icon: 'Link', 
      label: 'Link', 
      action: () => insertText('[', '](url)', 'link text'),
      shortcut: 'Ctrl+K'
    },
    { 
      icon: 'Code', 
      label: 'Inline Code', 
      action: () => insertText('`', '`', 'code'),
      shortcut: 'Ctrl+E'
    },
    { 
      icon: 'FileCode', 
      label: 'Code Block', 
      action: () => insertText('\n```\n', '\n```\n', 'code block'),
      shortcut: 'Ctrl+Shift+C'
    },
    { 
      icon: 'List', 
      label: 'Bullet List', 
      action: () => insertText('\n- ', '', 'list item'),
      shortcut: 'Ctrl+L'
    },
    { 
      icon: 'ListOrdered', 
      label: 'Numbered List', 
      action: () => insertText('\n1. ', '', 'list item'),
      shortcut: 'Ctrl+Shift+L'
    },
    { 
      icon: 'Quote', 
      label: 'Quote', 
      action: () => insertText('\n> ', '', 'quoted text'),
      shortcut: 'Ctrl+Q'
    }
  ];

  if (preview) {
    return (
      <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
        <div 
          className="prose prose-sm max-w-none text-foreground"
          dangerouslySetInnerHTML={{ 
            __html: value?.replace(/\n/g, '<br/>') || '<p class="text-muted-foreground">Nothing to preview</p>' 
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-md border">
        {toolbarButtons?.map((button, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button?.action}
            title={`${button?.label} (${button?.shortcut})`}
            className="h-8 w-8 p-0"
          >
            <Icon name={button?.icon} size={16} />
          </Button>
        ))}
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertText('\n![alt text](image-url)\n')}
          title="Insert Image"
          className="h-8 w-8 p-0"
        >
          <Icon name="Image" size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertText('\n$$\n', '\n$$\n', 'LaTeX formula')}
          title="Insert Formula"
          className="h-8 w-8 p-0"
        >
          <Icon name="Calculator" size={16} />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e?.target?.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your comprehensive answer here... 

Tips:
- Use **bold** and *italic* for emphasis
- Add code blocks with ```
- Include formulas with $$LaTeX$$
- Break down complex solutions into steps
- Provide examples when helpful

Remember: Quality answers help the entire UC community!"
          className="w-full min-h-[400px] max-h-[600px] p-4 text-sm font-mono resize-y border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          spellCheck="true"
        />
        
        {/* Character indicator */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          {value?.length || 0} characters
        </div>
      </div>

      {/* Quick shortcuts hint */}
      <div className="text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <span><kbd className="px-1 bg-muted rounded">Ctrl+S</kbd> Save draft</span>
          <span><kbd className="px-1 bg-muted rounded">Tab</kbd> Indent</span>
          <span><kbd className="px-1 bg-muted rounded">Ctrl+B</kbd> Bold</span>
          <span><kbd className="px-1 bg-muted rounded">Ctrl+I</kbd> Italic</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
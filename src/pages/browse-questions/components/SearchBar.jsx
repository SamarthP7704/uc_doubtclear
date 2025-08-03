import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ value, onChange, placeholder = "Search questions..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange('');
    inputRef?.current?.focus();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    inputRef?.current?.blur();
  };

  // Auto-focus on mount for desktop
  useEffect(() => {
    if (window?.innerWidth >= 768) {
      inputRef?.current?.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`
        relative flex items-center bg-background border border-border rounded-lg transition-all duration-200
        ${isFocused ? 'border-primary ring-2 ring-primary/20' : 'hover:border-border-hover'}
      `}>
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-3 text-muted-foreground" 
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e?.target?.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={16} />
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
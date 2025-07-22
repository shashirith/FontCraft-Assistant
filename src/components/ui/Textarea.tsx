import React, { useRef, useCallback, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  autoResize?: boolean;
  maxHeight?: number;
  minHeight?: number;
  helperText?: string;
}

export interface TextareaRef {
  focus: () => void;
  blur: () => void;
  reset: () => void;
  getHeight: () => number;
}

const Textarea = React.forwardRef<TextareaRef, TextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    leftIcon, 
    rightIcon, 
    autoResize = false,
    maxHeight = 120,
    minHeight = 40,
    helperText,
    onChange,
    onKeyDown,
    ...props 
  }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const textareaId = React.useId();
    
    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea && autoResize) {
        textarea.style.height = 'auto';
        const newHeight = Math.max(
          Math.min(textarea.scrollHeight, maxHeight),
          minHeight
        );
        textarea.style.height = `${newHeight}px`;
      }
    }, [autoResize, maxHeight, minHeight]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      if (autoResize) {
        adjustHeight();
      }
    };

    React.useEffect(() => {
      if (autoResize) {
        adjustHeight();
      }
    }, [props.value, adjustHeight, autoResize]);

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      blur: () => textareaRef.current?.blur(),
      reset: () => {
        if (textareaRef.current && autoResize) {
          textareaRef.current.style.height = 'auto';
        }
      },
      getHeight: () => textareaRef.current?.offsetHeight || 0,
    }));
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute top-3 left-3 flex items-start pointer-events-none z-10">
              <div className="h-5 w-5 text-gray-400">
                {leftIcon}
              </div>
            </div>
          )}
          
          <textarea
            id={textareaId}
            ref={textareaRef}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            className={cn(
              'flex w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm',
              'placeholder:text-gray-500 dark:placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors resize-none',
              'custom-scrollbar',
              'break-words overflow-wrap-anywhere word-break-break-word',
              'whitespace-pre-wrap',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:ring-red-500',
              !autoResize && 'h-20',
              className
            )}
            style={autoResize ? { 
              height: 'auto', 
              minHeight: `${minHeight}px`, 
              maxHeight: `${maxHeight}px` 
            } : undefined}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute top-3 right-3 flex items-start">
              <div className="h-5 w-5 text-gray-400">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <div className="mt-1">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea; 
import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Textarea, { TextareaRef } from '@/components/ui/Textarea';
import { useChat } from '@/hooks/useChat';
import ReplyPreview from './ReplyPreview';

interface MessageInputProps {
  onSendMessage: (content: string, replyToId?: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const MessageInput = React.memo<MessageInputProps>(({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
  className,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<TextareaRef>(null);
  const sendingRef = useRef<string | null>(null);
  const { state, actions } = useChat();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }, []);

  const replyingToMessage = state.replyTo;
  
  // Find the sender of the message being replied to
  const replyingSender = replyingToMessage 
    ? state.activeChat?.participants.find(p => p.id === replyingToMessage.senderId)
    : undefined;

  const handleSend = useCallback(async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending || disabled) return;
    
    if (sendingRef.current === trimmedMessage) {
      console.warn('Duplicate send prevented for:', trimmedMessage);
      return;
    }

    setIsSending(true);
    sendingRef.current = trimmedMessage;
    
    try {
      await onSendMessage(trimmedMessage, replyingToMessage?.id);
      setMessage('');
      textareaRef.current?.reset();
      // Clear reply state after sending
      if (replyingToMessage) {
        actions.replyToMessage(null);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
      sendingRef.current = null;
    }
  }, [message, replyingToMessage, isSending, disabled, onSendMessage, actions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleCancelReply = useCallback(() => {
    actions.replyToMessage(null);
  }, [actions]);

  React.useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className={cn('border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800', className)}>
      {/* Reply Preview */}
      {replyingToMessage && replyingSender && (
        <ReplyPreview
          replyTo={replyingToMessage}
          sender={replyingSender}
          onClose={handleCancelReply}
        />
      )}
      
      <div className="flex items-start gap-2 p-3 md:p-4 pb-safe">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            autoResize
            minHeight={40}
            maxHeight={120}
            helperText="Press Enter to send, Shift+Enter for new line"
            className="border-gray-300 dark:border-gray-600 text-base md:text-sm"
          />
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isSending || disabled}
          isLoading={isSending}
          size="md"
          className="flex-shrink-0 min-w-[44px] min-h-[44px] touch-manipulation"
          aria-label="Send message"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput; 
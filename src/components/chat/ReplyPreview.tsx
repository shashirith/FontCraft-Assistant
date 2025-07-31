import React from 'react';
import { cn, truncateText } from '@/lib/utils';
import { Message, User } from '@/lib/types';

interface ReplyPreviewProps {
  replyTo: Message;
  sender: User;
  onClose: () => void;
  className?: string;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  replyTo,
  sender,
  onClose,
  className,
}) => {
  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-l-4 border-blue-500',
      className
    )}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <svg
            className="w-4 h-4 text-blue-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Replying to {sender.name}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 overflow-hidden">
          <span className="block truncate">
            {truncateText(replyTo.content, 100)}
          </span>
        </p>
      </div>
      
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Cancel reply"
      >
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ReplyPreview; 
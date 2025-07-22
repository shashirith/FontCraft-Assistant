import React from 'react';
import { cn } from '@/lib/utils';
import { Chat, User } from '@/lib/types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Avatar from '@/components/ui/Avatar';

interface ChatWindowProps {
  chat: Chat | null;
  currentUser: User;
  onSendMessage: (content: string) => Promise<void>;
  onBackToChats?: () => void;
  showBackButton?: boolean;
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  currentUser,
  onSendMessage,
  onBackToChats,
  showBackButton = false,
  className,
}) => {
  if (!chat) {
    return (
      <div className={cn('flex-1 flex items-center h-full justify-center bg-gray-50 dark:bg-gray-900', className)}>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to Chat
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Select a chat from the sidebar to start messaging, or create a new chat to begin a conversation.
          </p>
        </div>
      </div>
    );
  }

  const otherParticipants = chat.participants.filter(p => p.id !== currentUser.id);
  const isDirectChat = chat.type === 'direct' && otherParticipants.length === 1;
  const otherUser = isDirectChat ? otherParticipants[0] : null;

  return (
    <div className={cn('flex flex-col h-full bg-white dark:bg-gray-800 overflow-hidden', className)}>
      <div className="flex items-center px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center flex-1">
          {showBackButton && onBackToChats && (
            <button
              onClick={onBackToChats}
              className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden"
              aria-label="Back to chats"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          
          <Avatar
            src={chat.avatar || otherUser?.avatar}
            name={chat.name}
            userId={chat.id}
            size="md"
            isOnline={isDirectChat ? otherUser?.isOnline : undefined}
            className="mr-3"
          />
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {chat.name}
            </h1>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              {isDirectChat && otherUser ? (
                <span>
                  {otherUser.isOnline ? 'Online' : `Last seen ${otherUser.lastSeen ? new Date(otherUser.lastSeen).toLocaleDateString() : 'recently'}`}
                </span>
              ) : (
                <span>
                  {chat.participants.length} participants
                  {chat.description && ` • ${chat.description}`}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Start video call"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Start audio call"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Chat information"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      <MessageList
        messages={chat.messages}
        users={chat.participants}
        currentUserId={currentUser.id}
        className="flex-1"
      />

      <MessageInput
        onSendMessage={onSendMessage}
        placeholder={`Message ${chat.name}...`}
      />
    </div>
  );
};

export default ChatWindow; 
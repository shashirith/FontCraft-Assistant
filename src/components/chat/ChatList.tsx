import React, { useState, useCallback } from 'react';
import { cn, formatTimestamp, truncateText } from '@/lib/utils';
import { Chat } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ChatListProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chatId: string) => void;
  onChatDelete: (chatId: string) => void;
  onCreateChat: () => void;
  className?: string;
}

const ChatList = React.memo<ChatListProps>(({
  chats,
  activeChat,
  onChatSelect,
  onChatDelete,
  onCreateChat,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredChats = React.useMemo(() => {
    if (!searchQuery.trim()) return chats;
    
    const query = searchQuery.toLowerCase().trim();
    return chats.filter(chat => 
      chat.name.toLowerCase().includes(query) ||
      chat.lastMessage?.content.toLowerCase().includes(query) ||
      chat.participants.some(p => p.name.toLowerCase().includes(query))
    );
  }, [chats, searchQuery]);

  const handleDeleteClick = useCallback((e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setShowDeleteConfirm(chatId);
  }, []);

  const handleDeleteConfirm = useCallback(async (chatId: string) => {
    try {
      await onChatDelete(chatId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  }, [onChatDelete]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(null);
  }, []);

  return (
    <div className={cn('flex flex-col h-full bg-gray-50 dark:bg-gray-900', className)}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Chats
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={onCreateChat}
              size="sm"
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          </div>
        </div>
        
        <Input
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start a conversation by creating a new chat'
              }
            </p>
            {!searchQuery && (
              <Button onClick={onCreateChat} variant="secondary">
                Create your first chat
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredChats.map((chat) => (
              <div
                key={`${chat.id}-${chat.lastMessage?.id || 'no-msg'}-${chat.lastMessage?.timestamp.getTime() || chat.updatedAt.getTime()}`}
                className={cn(
                  'relative flex items-center p-4 cursor-pointer transition-colors group',
                  'hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700',
                  'min-h-[72px] touch-manipulation',
                  activeChat?.id === chat.id && 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500'
                )}
                onClick={() => onChatSelect(chat.id)}
              >
                <div className="flex-shrink-0 mr-3">
                  <Avatar
                    src={chat.avatar}
                    name={chat.name}
                    userId={chat.id}
                    size="md"
                    isOnline={chat.type === 'direct' ? chat.participants[1]?.isOnline : undefined}
                  />
                </div>

                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1 min-w-0">
                      {chat.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(chat.lastMessage.timestamp)}
                        </span>
                      )}
                      
                      <button
                        onClick={(e) => handleDeleteClick(e, chat.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete chat"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between min-w-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1 min-w-0">
                      {chat.lastMessage 
                        ? truncateText(chat.lastMessage.content, 50)
                        : chat.messages.length > 0 
                          ? truncateText(chat.messages[chat.messages.length - 1].content, 50)
                          : 'No messages yet'
                      }
                    </p>
                   
                    
                    {chat.unreadCount > 0 && (
                      <span className="flex-shrink-0 ml-2 px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded-full">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {showDeleteConfirm === chat.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 flex items-center justify-center z-10 rounded border border-red-200 dark:border-red-800">
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-900 dark:text-gray-100 mb-3">
                        Delete this chat?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteConfirm(chat.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDeleteCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

ChatList.displayName = 'ChatList';

export default ChatList; 
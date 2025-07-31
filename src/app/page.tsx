'use client';

import React, { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import CreateChatModal from '@/components/chat/CreateChatModal';
import { cn } from '@/lib/utils';

export default function ChatApp() {
  const { state, actions } = useChat();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleChatSelect = (chatId: string) => {
    actions.setActiveChat(chatId);
    actions.markAsRead(chatId);
    setShowMobileChat(true);
  };

  const handleBackToChats = () => {
    setShowMobileChat(false);
  };

  const handleSendMessage = async (content: string, replyToId?: string) => {
    if (!state.activeChat) return;
    
    await actions.sendMessage({
      chatId: state.activeChat.id,
      content,
      type: 'text',
      replyToId,
    });
  };

  const handleCreateChat = async (name: string, type: 'direct' | 'group' | 'channel') => {
    await actions.createChat({
      name,
      type,
      participantIds: [state.currentUser.id],
    });
  };

  const handleDeleteChat = async (chatId: string) => {
    await actions.deleteChat(chatId);
  };

  if (state.isLoading && state.chats.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Loading chats...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we load your conversations.
          </p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {state.error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className={cn(
        "w-full md:w-80 md:flex-shrink-0 md:border-r border-gray-200 dark:border-gray-700",
        showMobileChat ? "hidden md:block" : "block"
      )}>
        <ChatList
          chats={state.chats}
          activeChat={state.activeChat}
          onChatSelect={handleChatSelect}
          onChatDelete={handleDeleteChat}
          onCreateChat={() => setShowCreateModal(true)}
        />
      </div>

      <div className={cn(
        "w-full md:flex-1",
        showMobileChat ? "block" : "hidden md:block"
      )}>
        <ChatWindow
          chat={state.activeChat}
          currentUser={state.currentUser}
          onSendMessage={handleSendMessage}
          onBackToChats={handleBackToChats}
          showBackButton={showMobileChat}
        />
      </div>

      <CreateChatModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
}

'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { Chat, ChatState, Message, CreateChatRequest, SendMessageRequest, UseChatReturn } from '@/lib/types';
import { apiStubs, currentUser } from '@/lib/sample-data';

// Action types for the reducer
type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'ADD_CHAT'; payload: Chat }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'UPDATE_CHAT'; payload: Chat }
  | { type: 'SET_ACTIVE_CHAT'; payload: Chat | null }
  | { type: 'SET_REPLY_TO'; payload: Message | null }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'MARK_AS_READ'; payload: string };

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  currentUser,
  isLoading: false,
  error: null,
  replyTo: null,
};

// Reducer function to manage state updates
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_CHATS':
      const sortedChats = action.payload.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      return { ...state, chats: sortedChats, isLoading: false };
    
    case 'ADD_CHAT':
      return {
        ...state,
        chats: [action.payload, ...state.chats],
        activeChat: action.payload,
        isLoading: false,
      };
    
    case 'DELETE_CHAT':
      const newChats = state.chats.filter(chat => chat.id !== action.payload);
      const newActiveChat = state.activeChat?.id === action.payload ? null : state.activeChat;
      return {
        ...state,
        chats: newChats,
        activeChat: newActiveChat,
        isLoading: false,
      };
    
    case 'UPDATE_CHAT':
      const updatedChats = state.chats.map(chat =>
        chat.id === action.payload.id ? action.payload : chat
      );
      const sortedUpdatedChats = updatedChats.sort((a, b) => {
        const aTime = a.lastMessage?.timestamp.getTime() || a.updatedAt.getTime();
        const bTime = b.lastMessage?.timestamp.getTime() || b.updatedAt.getTime();
        return bTime - aTime;
      });
      
      const updatedActiveChat = state.activeChat?.id === action.payload.id 
        ? action.payload 
        : state.activeChat;
      
      return {
        ...state,
        chats: sortedUpdatedChats,
        activeChat: updatedActiveChat,
      };
    
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload };
    
    case 'SET_REPLY_TO':
      return { ...state, replyTo: action.payload };
    
    case 'ADD_MESSAGE':
      const { chatId, message } = action.payload;
      const chatsWithNewMessage = state.chats.map(chat => {
        if (chat.id === chatId) {
          const updatedMessages = [...chat.messages, message];
          const isActiveChat = state.activeChat?.id === chatId;
          return {
            ...chat,
            messages: updatedMessages,
            lastMessage: { ...message },
            updatedAt: new Date(message.timestamp),
            unreadCount: isActiveChat ? 0 : chat.unreadCount + 1,
          };
        }
        return chat;
      });

      const sortedChatsWithMessage = chatsWithNewMessage.sort((a, b) => {
        const aTime = a.lastMessage?.timestamp.getTime() || a.updatedAt.getTime();
        const bTime = b.lastMessage?.timestamp.getTime() || b.updatedAt.getTime();
        return bTime - aTime;
      });

      const activeAfterMessage = state.activeChat?.id === chatId 
        ? sortedChatsWithMessage.find(chat => chat.id === chatId) || state.activeChat
        : state.activeChat;

      return {
        ...state,
        chats: sortedChatsWithMessage,
        activeChat: activeAfterMessage ? { ...activeAfterMessage } : null,
      };
    
    case 'MARK_AS_READ':
      const chatsMarkedRead = state.chats.map(chat =>
        chat.id === action.payload ? { ...chat, unreadCount: 0 } : chat
      );
      const activeMarkedRead = state.activeChat?.id === action.payload 
        ? { ...state.activeChat, unreadCount: 0 }
        : state.activeChat;
      
      return {
        ...state,
        chats: chatsMarkedRead,
        activeChat: activeMarkedRead,
      };
    
    default:
      return state;
  }
};

// Create the context
const ChatContext = createContext<UseChatReturn | null>(null);

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load chats on mount
  useEffect(() => {
    const loadChats = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        const chats = await apiStubs.getChats();
        const chatsWithLastMessage = chats.map(chat => ({
          ...chat,
          lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : undefined
        }));
        
        dispatch({ type: 'SET_CHATS', payload: chatsWithLastMessage });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to load chats'
        });
      }
    };

    loadChats();
  }, []);

  // Actions
  const createChat = useCallback(async (request: CreateChatRequest): Promise<Chat> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const newChat = await apiStubs.createChat(request.name, request.type);
      
      const chatWithLastMessage = {
        ...newChat,
        lastMessage: newChat.messages.length > 0 ? newChat.messages[newChat.messages.length - 1] : undefined
      };
      
      dispatch({ type: 'ADD_CHAT', payload: chatWithLastMessage });
      return chatWithLastMessage;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create chat';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const deleteChat = useCallback(async (chatId: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await apiStubs.deleteChat(chatId);
      dispatch({ type: 'DELETE_CHAT', payload: chatId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete chat';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const sendMessage = useCallback(async (request: SendMessageRequest): Promise<Message> => {
    try {
      const message = await apiStubs.sendMessage(request.chatId, request.content, request.replyToId);
      dispatch({ type: 'ADD_MESSAGE', payload: { chatId: request.chatId, message } });
      return message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const replyToMessage = useCallback((message: Message | null) => {
    dispatch({ type: 'SET_REPLY_TO', payload: message });
  }, []);

  const setActiveChat = useCallback((chatId: string | null) => {
    const activeChat = chatId ? state.chats.find(chat => chat.id === chatId) || null : null;
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: activeChat });
  }, [state.chats]);

  const markAsRead = useCallback((chatId: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: chatId });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const actions = useMemo(() => ({
    createChat,
    deleteChat,
    sendMessage,
    setActiveChat,
    markAsRead,
    replyToMessage,
    clearError,
  }), [createChat, deleteChat, sendMessage, setActiveChat, markAsRead, replyToMessage, clearError]);

  const contextValue = useMemo(() => ({
    state,
    actions,
  }), [state, actions]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChatContext = (): UseChatReturn => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}; 
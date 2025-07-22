import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chat, ChatState, Message, CreateChatRequest, SendMessageRequest, UseChatReturn } from '@/lib/types';
import { apiStubs, currentUser } from '@/lib/sample-data';

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  currentUser,
  isLoading: false,
  error: null,
};

export const useChat = (): UseChatReturn => {
  const [state, setState] = useState<ChatState>(initialState);

  useEffect(() => {
    const loadChats = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const chats = await apiStubs.getChats();
        const chatsWithLastMessage = chats.map(chat => ({
          ...chat,
          lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : undefined
        }));
        
        setState(prev => ({ 
          ...prev, 
          chats: chatsWithLastMessage.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
          isLoading: false 
        }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Failed to load chats',
          isLoading: false 
        }));
      }
    };

    loadChats();
  }, []);

  const createChat = useCallback(async (request: CreateChatRequest): Promise<Chat> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const newChat = await apiStubs.createChat(request.name, request.type);
      
      const chatWithLastMessage = {
        ...newChat,
        lastMessage: newChat.messages.length > 0 ? newChat.messages[newChat.messages.length - 1] : undefined
      };
      
      setState(prev => ({
        ...prev,
        chats: [chatWithLastMessage, ...prev.chats],
        activeChat: chatWithLastMessage,
        isLoading: false,
      }));
      
      return chatWithLastMessage;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to create chat',
        isLoading: false 
      }));
      throw error;
    }
  }, []);

  const deleteChat = useCallback(async (chatId: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await apiStubs.deleteChat(chatId);
      
      setState(prev => {
        const newChats = prev.chats.filter(chat => chat.id !== chatId);
        const newActiveChat = prev.activeChat?.id === chatId ? null : prev.activeChat;
        
        return {
          ...prev,
          chats: newChats,
          activeChat: newActiveChat,
          isLoading: false,
        };
      });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to delete chat',
        isLoading: false 
      }));
      throw error;
    }
  }, []);

  const sendMessage = useCallback(async (request: SendMessageRequest): Promise<Message> => {
    try {
      const message = await apiStubs.sendMessage(request.chatId, request.content);
      
      setState(prev => {
        const updatedChats = prev.chats.map(chat => {
          if (chat.id === request.chatId) {
            const updatedMessages = [...chat.messages, message];
            const isActiveChat = prev.activeChat?.id === request.chatId;
            return {
              ...chat,
              messages: updatedMessages,
              lastMessage: { ...message },
              updatedAt: new Date(message.timestamp),
              unreadCount: isActiveChat ? 0 : chat.unreadCount,
            };
          }
          return chat;
        });

        const sortedChats = updatedChats.sort((a, b) => {
          const aTime = a.lastMessage?.timestamp.getTime() || a.updatedAt.getTime();
          const bTime = b.lastMessage?.timestamp.getTime() || b.updatedAt.getTime();
          return bTime - aTime;
        });

        const updatedActiveChat = prev.activeChat?.id === request.chatId 
          ? sortedChats.find(chat => chat.id === request.chatId) || prev.activeChat
          : prev.activeChat;

        return {
          ...prev,
          chats: sortedChats,
          activeChat: updatedActiveChat ? { ...updatedActiveChat } : null,
        };
      });
      
      return message;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to send message' 
      }));
      throw error;
    }
  }, []);

  const setActiveChat = useCallback((chatId: string | null) => {
    setState(prev => {
      const activeChat = chatId ? prev.chats.find(chat => chat.id === chatId) || null : null;
      return { ...prev, activeChat: activeChat ? { ...activeChat } : null };
    });
  }, []);

  const markAsRead = useCallback((chatId: string) => {
    setState(prev => ({
      ...prev,
      chats: prev.chats.map(chat =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ),
      activeChat: prev.activeChat?.id === chatId 
        ? { ...prev.activeChat, unreadCount: 0 }
        : prev.activeChat
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const actions = useMemo(() => ({
    createChat,
    deleteChat,
    sendMessage,
    setActiveChat,
    markAsRead,
    clearError,
  }), [createChat, deleteChat, sendMessage, setActiveChat, markAsRead, clearError]);

  return useMemo(() => ({
    state,
    actions,
  }), [state, actions]);
}; 
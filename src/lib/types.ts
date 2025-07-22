export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  edited?: boolean;
  editedAt?: Date;
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  description?: string;
}

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  currentUser: User;
  isLoading: boolean;
  error: string | null;
}

export interface CreateChatRequest {
  name: string;
  type: 'direct' | 'group' | 'channel';
  participantIds: string[];
  description?: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  type: 'text' | 'image' | 'file';
}

export interface ChatListItem {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export interface MessageItemProps {
  message: Message;
  sender: User;
  isOwn: boolean;
  showAvatar: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface UseChatReturn {
  state: ChatState;
  actions: {
    createChat: (request: CreateChatRequest) => Promise<Chat>;
    deleteChat: (chatId: string) => Promise<void>;
    sendMessage: (request: SendMessageRequest) => Promise<Message>;
    setActiveChat: (chatId: string | null) => void;
    markAsRead: (chatId: string) => void;
    clearError: () => void;
  };
} 
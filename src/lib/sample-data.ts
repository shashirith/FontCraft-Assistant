import { User, Chat, Message } from './types';
import { generateId } from './utils';

export const sampleUsers: User[] = [
  {
    id: 'user-1',
    name: 'You',
    avatar: '',
    isOnline: true,
  },
  {
    id: 'user-2',
    name: 'FontCraft Assistant',
    avatar: '🤖',
    isOnline: true,
    lastSeen: new Date('2024-01-15T14:30:00Z'),
  },
  {
    id: 'user-3',
    name: 'Typography Expert',
    avatar: '✨',
    isOnline: true,
  },
  {
    id: 'user-4',
    name: 'Font Advisor',
    avatar: '🎨',
    isOnline: true,
  },
  {
    id: 'user-5',
    name: 'Custom Type Designer',
    avatar: '📝',
    isOnline: true,
  },
  {
    id: 'user-6',
    name: 'Brand Identity Bot',
    avatar: '🏢',
    isOnline: false,
    lastSeen: new Date('2024-01-15T09:45:00Z'),
  },
];

export const currentUser = sampleUsers[0];

const createWelcomeMessages = (): Message[] => [
  {
    id: 'msg-bot-1',
    content: "👋 Welcome to FontCraft! I'm here to help you discover the perfect typeface for your project. What kind of design are you working on?",
    senderId: 'user-2',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    type: 'text',
  },
  {
    id: 'msg-you-1',
    content: "Hi! I'm designing a logo for a modern tech startup. Looking for something clean and professional.",
    senderId: 'user-1',
    timestamp: new Date('2024-01-15T10:32:00Z'),
    type: 'text',
  },
  {
    id: 'msg-bot-2',
    content: "Perfect choice! For tech startups, I'd recommend exploring our geometric sans-serif collection. Fonts like Proxima Nova, Avenir, or our custom 'TechForward' family work beautifully for logos. Would you like to see some samples?",
    senderId: 'user-2',
    timestamp: new Date('2024-01-15T10:33:00Z'),
    type: 'text',
  },
  {
    id: 'msg-you-2',
    content: "Yes, that sounds great! I'd especially like to see the TechForward family.",
    senderId: 'user-1',
    timestamp: new Date('2024-01-15T10:35:00Z'),
    type: 'text',
  },
  {
    id: 'msg-bot-3',
    content: "Excellent! TechForward comes in 8 weights from Thin to Black, with both regular and italic variants. It features clean geometric forms with subtle humanist touches. I'll prepare a sample sheet for you right away! 🎨",
    senderId: 'user-2',
    timestamp: new Date('2024-01-15T10:36:00Z'),
    type: 'text',
  },
];

const createTypographyMessages = (): Message[] => [
  {
    id: 'msg-expert-1',
    content: "🌟 Hello! I'm your Typography Expert. I see you're interested in pairing fonts for your website. Let me help you create a harmonious typographic hierarchy!",
    senderId: 'user-3',
    timestamp: new Date('2024-01-15T09:00:00Z'),
    type: 'text',
  },
  {
    id: 'msg-you-3',
    content: "That would be amazing! I'm working on an e-commerce site for handmade jewelry.",
    senderId: 'user-1',
    timestamp: new Date('2024-01-15T09:15:00Z'),
    type: 'text',
  },
  {
    id: 'msg-expert-2',
    content: "How lovely! For jewelry brands, I suggest pairing an elegant serif for headings (like Playfair Display or our 'Elegance Serif') with a clean sans-serif for body text (Inter or 'Clarity Sans'). This creates sophistication while maintaining readability.",
    senderId: 'user-3',
    timestamp: new Date('2024-01-15T09:30:00Z'),
    type: 'text',
  },
  {
    id: 'msg-you-4',
    content: "That combination sounds perfect! How do I ensure good contrast and readability?",
    senderId: 'user-1',
    timestamp: new Date('2024-01-15T09:45:00Z'),
    type: 'text',
  },
];

const createCustomDesignMessages = (): Message[] => [
  {
    id: 'msg-designer-1',
    content: "✨ Greetings! I'm here to discuss custom typeface creation. Looking to create something unique for your brand?",
    senderId: 'user-5',
    timestamp: new Date('2024-01-15T08:00:00Z'),
    type: 'text',
  },
  {
    id: 'msg-you-5',
    content: "Yes! I represent a luxury hotel chain and we want a signature typeface that reflects our premium brand.",
    senderId: 'user-1',
    timestamp: new Date('2024-01-15T08:15:00Z'),
    type: 'text',
  },
  {
    id: 'msg-designer-2',
    content: "Wonderful! Custom typefaces are perfect for luxury brands. We can create a bespoke font family that embodies sophistication, exclusivity, and your brand values. The process typically takes 8-12 weeks. Shall we schedule a consultation?",
    senderId: 'user-5',
    timestamp: new Date('2024-01-15T08:20:00Z'),
    type: 'text',
  },
];

const createSampleChats = (): Chat[] => {
  const welcomeMessages = createWelcomeMessages();
  const typographyMessages = createTypographyMessages();
  const customMessages = createCustomDesignMessages();

  return [
    {
      id: 'chat-1',
      name: 'FontCraft Assistant',
      type: 'direct',
      participants: [sampleUsers[0], sampleUsers[1]],
      messages: welcomeMessages,
      lastMessage: welcomeMessages[welcomeMessages.length - 1],
      unreadCount: 1,
      createdAt: new Date('2024-01-10T00:00:00Z'),
      updatedAt: new Date('2024-01-15T10:36:00Z'),
    },
    {
      id: 'chat-2',
      name: 'Typography Expert',
      type: 'direct',
      participants: [sampleUsers[0], sampleUsers[2]],
      messages: typographyMessages,
      lastMessage: typographyMessages[typographyMessages.length - 1],
      unreadCount: 0,
      createdAt: new Date('2024-01-08T00:00:00Z'),
      updatedAt: new Date('2024-01-15T09:45:00Z'),
      description: 'Font pairing and typography guidance',
    },
    {
      id: 'chat-3',
      name: 'Custom Type Designer',
      type: 'direct',
      participants: [sampleUsers[0], sampleUsers[4]],
      messages: customMessages,
      lastMessage: customMessages[customMessages.length - 1],
      unreadCount: 0,
      createdAt: new Date('2024-01-12T00:00:00Z'),
      updatedAt: new Date('2024-01-15T08:20:00Z'),
    },
  ];
};

export const sampleChats: Chat[] = createSampleChats();

export const apiStubs = {
  getChats: async (): Promise<Chat[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...sampleChats];
  },

  getChat: async (chatId: string): Promise<Chat | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return sampleChats.find(chat => chat.id === chatId) || null;
  },

  createChat: async (name: string, type: 'direct' | 'group' | 'channel'): Promise<Chat> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newChat: Chat = {
      id: generateId(),
      name,
      type,
      participants: [currentUser],
      messages: [],
      lastMessage: undefined,
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    sampleChats.unshift(newChat);
    return newChat;
  },

  sendMessage: async (chatId: string, content: string): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const message: Message = {
      id: generateId(),
      content,
      senderId: currentUser.id,
      timestamp: new Date(),
      type: 'text',
    };
    
    return message;
  },

  deleteChat: async (chatId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = sampleChats.findIndex(chat => chat.id === chatId);
    if (index !== -1) {
      sampleChats.splice(index, 1);
    }
  },

  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...sampleUsers];
  },
}; 
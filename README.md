# FontCraft Chat – The Ultimate Typography & Font Design Conversation Platform! 🎨📝

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Performance](#performance)
- [Components](#components)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Development](#development)

---

## About

**FontCraft Chat** is a modern, full-stack chat application designed specifically for typography enthusiasts, font designers, and brand specialists. Connect with expert typography assistants, get personalized font recommendations, and discuss custom typeface solutions for your design projects in real-time.

Whether you're a designer looking for the perfect font pairing, a startup needing a custom brand typeface, or just passionate about typography, FontCraft Chat provides an intuitive platform to explore the world of fonts and typography with expert guidance.


## Technology Choices

### Next.js 15.4.2

We chose Next.js for this project because it provides a robust framework for building server-rendered React applications. It offers features like automatic code splitting, server-side rendering, and static site generation, which enhance performance and SEO for our chat platform.

### React 19.1.0

The latest React version provides enhanced concurrent features and improved performance for our real-time chat interface, ensuring smooth user interactions and optimal rendering.

### TypeScript 5

TypeScript ensures type safety throughout our codebase, making the chat application more maintainable and reducing runtime errors, especially important for complex chat state management.

### Tailwind CSS 4

Tailwind CSS provides utility-first styling that enables rapid UI development while maintaining consistency across our chat interface. The framework supports both light and dark themes seamlessly.

---

## Features

### 🗨️ Real-Time Chat Interface
- **Multiple Chat Types**: Support for direct messages, group chats, and channels
- **Live Messaging**: Real-time message sending and receiving
- **Message Types**: Text, image, and file sharing capabilities
- **Read Receipts**: Track message read status and unread counts

### 👥 Typography Expert Network
- **FontCraft Assistant** 🤖: AI-powered font recommendations
- **Typography Expert** ✨: Professional font pairing guidance  
- **Custom Type Designer** 📝: Bespoke typeface creation consultation
- **Brand Identity Bot** 🏢: Brand-focused typography solutions

### 🎨 Modern User Experience
- **Responsive Design**: Seamless experience across desktop and mobile
- **Dark/Light Theme**: Automatic theme switching based on user preference
- **Search Functionality**: Quick chat and message search
- **User Status**: Online/offline indicators and last seen timestamps

### 💬 Advanced Chat Features
- **Chat Management**: Create, delete, and organize conversations
- **User Profiles**: Avatar support with emoji and custom images
- **Message Actions**: Edit timestamps and message status tracking
- **Intuitive Navigation**: Easy switching between conversations

---

## Tech Stack

- **Framework**: [Next.js 15.4.2](https://nextjs.org/) - React framework for production
- **Frontend**: [React 19.1.0](https://reactjs.org/) - UI library
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Fonts**: [Geist & Geist Mono](https://vercel.com/font) - Modern typeface family
- **State Management**: Custom React hooks with Context
- **Utilities**: 
  - `clsx` - Conditional CSS classes
  - `tailwind-merge` - Tailwind class merging

---

## Getting Started

### Prerequisites

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager

### Installation

bash
# Clone the repository
```
git clone https://github.com/shashirith/fontcraft-chat.git
cd fontcraft-chat
```

# Install dependencies
```
npm install
```


# Start the development server
```
npm run dev
```


Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.



---

## Performance
<img width="1056" height="306" alt="image" src="https://github.com/user-attachments/assets/fd551e68-eb2d-470d-8e76-432b3a6cb8aa" />
<img width="1280" height="925" alt="image" src="https://github.com/user-attachments/assets/38ee5568-3ea8-4ab1-be0e-090f7860e7c9" />

---
## Components

### Chat Components

#### `ChatWindow.tsx`
- **Description**: Main chat interface displaying messages, user info, and input controls
- **Features**:
  - Real-time message display with user avatars
  - Responsive header with user status and action buttons
  - Video/audio call buttons and chat information access
  - Mobile-optimized navigation with back button support

#### `ChatList.tsx`
- **Description**: Sidebar component showing all user conversations
- **Features**:
  - Search functionality across chat names and messages
  - Unread message indicators and timestamps
  - Chat creation and deletion controls
  - Responsive design for mobile and desktop

#### `MessageList.tsx`
- **Description**: Scrollable container for displaying chat messages
- **Features**:
  - Grouped messages by sender and timestamp
  - Avatar display optimization for message threads
  - Smooth scrolling and performance optimization

#### `MessageInput.tsx`
- **Description**: Input component for composing and sending messages
- **Features**:
  - Multi-line text support with auto-resize
  - Send button with keyboard shortcuts
  - File attachment support preparation

#### `CreateChatModal.tsx`
- **Description**: Modal dialog for creating new conversations
- **Features**:
  - Chat type selection (direct, group, channel)
  - User search and selection interface
  - Form validation and error handling

### UI Components

#### `Avatar.tsx`
- **Description**: User avatar component with online status indicators
- **Features**:
  - Multiple size variants (sm, md, lg)
  - Online/offline status indicators
  - Emoji and image avatar support
  - Fallback to user initials

#### `Button.tsx`
- **Description**: Reusable button component with multiple variants
- **Features**:
  - Primary, secondary, and ghost variants
  - Loading states with spinners
  - Size variants and icon support

#### `Input.tsx`
- **Description**: Form input component with validation support
- **Features**:
  - Error state styling
  - Placeholder and label support
  - Keyboard accessibility

#### `Modal.tsx`
- **Description**: Overlay modal component for dialogs
- **Features**:
  - Backdrop click to close
  - Escape key handling
  - Focus management and accessibility

#### `Textarea.tsx`
- **Description**: Multi-line text input with auto-resize
- **Features**:
  - Automatic height adjustment
  - Character count support
  - Keyboard shortcuts integration

---

## Project Structure

```
src/
├── app/                         # Next.js app directory
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout with metadata and fonts
│   ├── page.tsx                 # Main chat application page
│   └── favicon.ico              # App icon
├── components/
│   ├── chat/                    # Chat-specific components
│   │   ├── ChatList.tsx         # Conversation sidebar
│   │   ├── ChatWindow.tsx       # Main chat interface
│   │   ├── CreateChatModal.tsx  # New chat creation
│   │   ├── MessageInput.tsx     # Message composition
│   │   ├── MessageItem.tsx      # Individual message display
│   │   └── MessageList.tsx      # Message container
│   ├── layout/                  # Layout components (future expansion)
│   └── ui/                      # Reusable UI components
│       ├── Avatar.tsx           # User avatar with status
│       ├── Button.tsx           # Button variants
│       ├── Input.tsx            # Form input component
│       ├── Modal.tsx            # Overlay modal
│       ├── Textarea.tsx         # Multi-line input
│       └── index.ts             # UI components barrel export
├── hooks/
│   └── useChat.ts               # Chat state management hook
├── lib/
│   ├── sample-data.ts           # Mock data for development
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions


---
```
## API Reference

### useChat Hook

The `useChat` hook provides state management and actions for the chat application:

#### State
typescript
interface ChatState {
  chats: Chat[];           // All user conversations
  activeChat: Chat | null; // Currently selected chat
  currentUser: User;       // Logged-in user information
  isLoading: boolean;      // Loading state indicator
  error: string | null;    // Error message if any
}


#### Actions
typescript
const actions = {
  createChat: (request: CreateChatRequest) => Promise<Chat>;
  deleteChat: (chatId: string) => Promise<void>;
  sendMessage: (request: SendMessageRequest) => Promise<Message>;
  setActiveChat: (chatId: string | null) => void;
  markAsRead: (chatId: string) => void;
  clearError: () => void;
};


### Data Types

#### User
typescript
interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}


#### Message
typescript
interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  edited?: boolean;
  editedAt?: Date;
}


#### Chat
typescript
interface Chat {
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


---

## Development

### Scripts

bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint


### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting (recommended)
- **Component Structure**: Functional components with TypeScript
- **State Management**: Custom hooks with useCallback and useMemo optimization

### Development Notes

- **Sample Data**: The app currently uses mock data from `src/lib/sample-data.ts`
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Performance**: Optimized with React.memo, useCallback, and useMemo
- **Accessibility**: ARIA labels and keyboard navigation support

---



## Acknowledgments

- **Next.js Team**: For the incredible React framework
- **Vercel**: For the Geist font family and development tools
- **Tailwind CSS**: For the utility-first CSS framework
- **Open Source Contributors**: For the amazing tools and libraries used in this project

---

import { useChatContext } from '@/contexts/ChatContext';
import { UseChatReturn } from '@/lib/types';

export const useChat = (): UseChatReturn => {
  return useChatContext();
}; 
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (name: string, type: 'direct' | 'group' | 'channel') => Promise<void>;
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({
  isOpen,
  onClose,
  onCreateChat,
}) => {
  const [chatName, setChatName] = useState('');
  const [chatType, setChatType] = useState<'direct' | 'group' | 'channel'>('direct');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = chatName.trim();
    if (!name) {
      setError('Please enter a chat name');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      await onCreateChat(name, chatType);
      setChatName('');
      setChatType('direct');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chat');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setChatName('');
      setChatType('direct');
      setError('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Chat"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Chat Name"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          placeholder="Enter chat name..."
          error={error}
          disabled={isCreating}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chat Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="direct"
                checked={chatType === 'direct'}
                onChange={(e) => setChatType(e.target.value as 'direct')}
                disabled={isCreating}
                className="mr-2"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">Direct Message</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">One-on-one conversation</div>
              </div>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="group"
                checked={chatType === 'group'}
                onChange={(e) => setChatType(e.target.value as 'group')}
                disabled={isCreating}
                className="mr-2"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">Group Chat</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Multiple participants</div>
              </div>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="channel"
                checked={chatType === 'channel'}
                onChange={(e) => setChatType(e.target.value as 'channel')}
                disabled={isCreating}
                className="mr-2"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">Channel</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Organized topic-based discussion</div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isCreating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isCreating}
            disabled={!chatName.trim() || isCreating}
            className="flex-1"
          >
            Create Chat
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateChatModal; 
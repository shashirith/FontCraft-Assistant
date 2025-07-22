import React from 'react';
import { cn, getInitials, getAvatarColor } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
  userId?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = '',
  size = 'md',
  isOnline,
  className,
  userId,
}) => {
  const [imageError, setImageError] = React.useState(false);
  
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };
  
  const onlineIndicatorSizes = {
    xs: 'h-1.5 w-1.5 bottom-0 right-0',
    sm: 'h-2 w-2 bottom-0 right-0',
    md: 'h-2.5 w-2.5 bottom-0 right-0',
    lg: 'h-3 w-3 bottom-0 right-0',
    xl: 'h-4 w-4 bottom-0.5 right-0.5',
  };
  
  const showImage = src && !imageError;
  const initials = getInitials(name);
  const avatarColor = userId ? getAvatarColor(userId) : 'bg-gray-500';
  
  const getAvatarAriaLabel = () => {
    let label = alt || name || 'User avatar';
    if (isOnline !== undefined) {
      label += isOnline ? ', Online' : ', Offline';
    }
    return label;
  };
  
  return (
    <div 
      className={cn('relative inline-block', className)}
      role="img"
      aria-label={getAvatarAriaLabel()}
    >
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden',
          sizes[size],
          !showImage && avatarColor,
          !showImage && 'text-white font-medium'
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
            aria-hidden="true"
          />
        ) : (
          <span className="select-none" aria-hidden="true">
            {initials || '?'}
          </span>
        )}
      </div>
      
      {isOnline !== undefined && (
        <div
          className={cn(
            'absolute rounded-full border-2 border-white dark:border-gray-800',
            onlineIndicatorSizes[size],
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          )}
          aria-hidden="true"
          role="presentation"
        />
      )}
    </div>
  );
};

export default Avatar; 
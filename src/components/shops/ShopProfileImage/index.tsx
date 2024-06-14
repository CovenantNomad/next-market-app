import { cn } from '@/lib/utils';
import { StoreIcon } from 'lucide-react';
import React from 'react';

type ShopProfileImageProps = {
  imageUrl?: string | null
  className?: string
}

const ShopProfileImage = ({ imageUrl, className }: ShopProfileImageProps) => {

  if (!imageUrl) {
    return (
      <div className={cn('w-14 h-14 flex justify-center items-center rounded-full bg-slate-200', className)}>
        <StoreIcon className='h-6 w-6' />
      </div>
    );
  }

  return (
    <div 
      className={cn('w-14 h-14 rounded-full bg-slate-200 bg-cover bg-center', className)} 
      style={{ backgroundImage: `url(${imageUrl})`}}  
    />
  );
};

export default ShopProfileImage;

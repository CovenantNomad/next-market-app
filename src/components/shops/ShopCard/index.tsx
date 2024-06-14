import React from 'react';
import ShopProfileImage from '../ShopProfileImage';
import { cn } from '@/lib/utils';

type ShopCardProps = {
  name: string;
  profileImageUrl?: string | null;
  productCount: number;
  followerCount: number;
  view?: 'row' | 'column'
  onClickTitleHandler?: () => void
  onClickProfileImageHandler?: () => void
  onClickProductCountHandler?: () => void
  onClickFollowCountHandler?: () => void
}

const ShopCard = ({ 
  name, 
  profileImageUrl, 
  productCount, 
  followerCount, 
  onClickTitleHandler,
  onClickProfileImageHandler,
  onClickProductCountHandler,
  onClickFollowCountHandler,
  view = 'row'
}: ShopCardProps) => {
  return (
    <div className={cn(view === 'row' ? 'flex items-center gap-x-6' : 'flex flex-col items-center justify-center h-full', 'py-3 px-4')}>
      <div
        onClick={onClickProfileImageHandler}
        className={onClickProfileImageHandler && 'cursor-pointer'}
      >
        <ShopProfileImage imageUrl={profileImageUrl} />
      </div>
      <div>
        <div 
          onClick={onClickTitleHandler} 
          className={cn(onClickTitleHandler && 'cursor-pointer', view === 'column' && 'flex justify-center mt-2')}
        >
          <span className={'text-lg font-bold'}>{name}</span>
        </div>
        <div className='flex item-center gap-x-2 leading-none text-gray-500 text-center mt-2'>
          <div 
            onClick={onClickProductCountHandler} 
            className={onClickProductCountHandler && 'cursor-pointer'}
          >
            <span>상품 {productCount}</span>
          </div>
          <span>|</span>
          <div 
            onClick={onClickFollowCountHandler} 
            className={onClickFollowCountHandler && 'cursor-pointer'}
          >
            <span>팔로워 {followerCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;

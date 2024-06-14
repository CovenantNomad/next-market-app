import { Skeleton } from '@/components/ui/skeleton';
import supabase from '@/lib/supabase/browserClient';
import { getMe } from '@/repository/me/getMe';
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount';
import { HeartIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type LikeItemProps = {}

const LikeItem = ({}: LikeItemProps) => {
  const [ shopId, setShopId ] = useState<string>()
  const [ likeCount, setLikeCount ] = useState<number>()

  useEffect(() => {
    (async () => {
      const { data: { shopId } } = await getMe(supabase)
      if (shopId === null) {
        setLikeCount(0)
        return 
      } 

      const { data: likeCount } = await getShopLikeCount(supabase, shopId)
      setLikeCount(likeCount)
      setShopId(shopId)

    })()
  }, [])

  return (
    <div className='flex flex-col justify-center items-center border border-black bg-white p-2'>
      <span className='text-xs font-bold'>찜한 상품</span>
      {likeCount === undefined ? (
        <div className='mt-2'>
          <Skeleton className='h-10 w-16 bg-gray-200'/>
        </div>
      ) : (
        <Link href={!shopId ? '#' : `/shops/${shopId}/likes`}>
          <div className='flex items-center gap-2 py-1'>
            <HeartIcon className='h-4 w-4 text-gray-400'/>
            <span className='text-gray-400 text-sm'>{likeCount}</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default LikeItem;

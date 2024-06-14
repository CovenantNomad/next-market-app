import { useEffect, useState } from 'react';
import { getShop } from '@/repository/shops/getShop';
import { TShop } from '@/types';

import { Skeleton } from '@/components/ui/skeleton';
import ShopProfileImage from '@/components/shops/ShopProfileImage';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import dynamic from 'next/dynamic';
import supabase from '@/lib/supabase/browserClient';

type ShopReviewItemProps = {
  contents: string
  createdBy: string
  createdAt: string
}

dayjs.extend(relativeTime).locale('ko')

const MarkdownViewer = dynamic(
  () => import('@/components/shared/MarkdownViewer'),
  {
    ssr: false,
    loading: () => (
      <div className='flex flex-col space-y-2'>
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    )
  }
)

const ShopReviewItem = ({ contents, createdAt, createdBy }: ShopReviewItemProps) => {
  const [ reviewer, setReviewer ] = useState<TShop>()

  useEffect(() => {
    (async () => {
      const { data } = await getShop(supabase, createdBy)
      setReviewer(data)

    })()

  }, [createdBy])

  if (!reviewer) {
    return (
      <div className="flex">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-5 pb-4 ml-4 border-b border-b-gray-200 h-32">
          <Skeleton className="h-4 w-[250px]" />
          <div className='space-y-2'>
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex'>
      <div>
        <ShopProfileImage imageUrl={reviewer.imageUrl || undefined} />
      </div>
      <div className='flex-1 w-0 pb-4 ml-4 border-b border-b-gray-300'>
        <div className='flex justify-between gap-x-1'>
          <span className='text-sm text-gray-500 truncate'>{reviewer.name}</span>
          <span className='text-sm text-gray-500 shrink-0'>{dayjs(createdAt).fromNow()}</span>
        </div>
        <div className='mt-3'>
          <MarkdownViewer value={contents} />
        </div>
      </div>
    </div>
  );
};

export default ShopReviewItem;

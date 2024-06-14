import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

import ShopProfileImage from '@/components/shops/ShopProfileImage';
import { Skeleton } from '@/components/ui/skeleton';
import { getProduct } from '@/repository/products/getProduct';
import { getShop } from '@/repository/shops/getShop';
import { TProduct, TShop } from '@/types';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import supabase from '@/lib/supabase/browserClient';


dayjs.extend(relativeTime).locale('ko')

type ReviewItemProps = {
  productId: string
  reviewerId: string
  contents: string
  createdAt: string
}

const MarkdownViewer = dynamic(
  () => import('@/components/shared/MarkdownViewer'),
  {
    ssr: false,
    loading: () => (
      <div className='flex flex-col space-y-2'>
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    )
  }
)


const ReviewItem = ({ productId, reviewerId, contents, createdAt }: ReviewItemProps) => {
  const [ data, setData ] = useState<{ reviewer: TShop, product: TProduct}>()

  useEffect(() => {
    (async () => {
      const [{ data: reviewer }, { data: product }] = await Promise.all([
        getShop(supabase, reviewerId),
        getProduct(supabase, productId)
      ])

      setData({ reviewer, product })
    })()

  }, [productId, reviewerId])

  if (!data) {
    return (
      <div className="flex items-center space-x-4 py-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  const { reviewer, product } = data

  return (
    <div className='flex py-4 px-5'>
      <ShopProfileImage imageUrl={reviewer.imageUrl || undefined} />
      <div className='ml-3 flex-1'>
        <div className='flex justify-between items-center'>
          <div>
            <div>
              <span className='font-bold'>{reviewer.name}</span>
              <span>님의 후기</span>
            </div>
            <Link href={`/products/${product.id}`} className='inline-flex items-center border border-gray-300 py-1 px-2 mt-3'>
              <span className='text-sm text-gray-500 leading-none'>{product.title}</span>
              <ChevronRightIcon className='h-4 w-4 text-gray-500' />
            </Link>
          </div>
          <div>
            <span className='text-gray-500'>{dayjs(createdAt).fromNow()}</span>
          </div>
        </div>
        <div className='pt-6'>
          <MarkdownViewer value={contents} />
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;

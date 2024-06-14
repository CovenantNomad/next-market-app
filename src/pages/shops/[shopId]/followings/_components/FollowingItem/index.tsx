import { useEffect, useState } from 'react';
import { getShop } from '@/repository/shops/getShop';
import { getShopInfomation } from '@/repository/shops/getShopInfomation';
import { getShopProducts } from '@/repository/shops/getShopProducts';
import { TProduct, TShop } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import ShopCard from '@/components/shops/ShopCard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase/browserClient';

type FollowingItemProps = {
  shopId: string
}

const FollowingItem = ({ shopId }: FollowingItemProps) => {
  const router = useRouter()
  const [ data, setData ] = useState<{ 
    shop: TShop, 
    products: TProduct[], 
    productCount: number, 
    followerCount: number
  }>()

  useEffect(() => {
    (async () => {
      const [
        { data: shop }, 
        { data: products },
        { data: { productCount, followerCount }},
      ] = await Promise.all([
        getShop(supabase, shopId),
        getShopProducts(supabase, { shopId, fromPage: 0, toPage: 1 }),
        getShopInfomation(supabase, shopId)
      ])

      setData({ shop, products, productCount, followerCount })
    })()

  }, [shopId])

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

  const { shop, products, productCount, followerCount } = data

  return (
    <div className='flex'>
      <div className='w-48'>
        <ShopCard 
          name={shop.name}
          profileImageUrl={shop.imageUrl || undefined}
          productCount={productCount}
          followerCount={followerCount}
          view={'column'}
          onClickTitleHandler={() => router.push(`/shops/${shop.id}`)}
          onClickProfileImageHandler={() => router.push(`/shops/${shop.id}`)}
          onClickProductCountHandler={() => router.push(`/shops/${shop.id}/products`)}
          onClickFollowCountHandler={() => router.push(`/shops/${shop.id}/followers`)}
        />
      </div>
      <div className='flex gap-x-4'>
        {products.slice(0, 3).map(({ id, imageUrls, title }) => (
          <Link href={`/products/${id}`} key={id} className='w-40 h-40'>
            <img src={imageUrls[0]} alt={title} className='w-full h-full' />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FollowingItem;

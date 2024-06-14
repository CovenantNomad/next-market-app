import React, { useEffect, useState } from 'react';
import ShopCard from '../ShopCard';
import { getShopInfomation } from '@/repository/shops/getShopInfomation';
import { Skeleton } from '@/components/ui/skeleton';
import supabase from '@/lib/supabase/browserClient';

type ShopItemProps = {
  id: string;
  name: string
  profileImageUrl?: string | null;
}

const ShopItem = ({ id, name, profileImageUrl }: ShopItemProps) => {
  const [ followerCount, setFollowerCount ] = useState<number | undefined>()
  const [ productCount, setProductCount ] = useState<number | undefined>()

  useEffect(() => {
    (async () => {
      const {data: { followerCount, productCount }} = await getShopInfomation(supabase, id)
      setFollowerCount(followerCount)
      setProductCount(productCount)
    })()
  }, [])

  if (productCount === undefined || followerCount === undefined) {
    return <Skeleton className='w-full h-20 border border-gray-300' />
  }

  return (
    <ShopCard
      name={name} 
      profileImageUrl={profileImageUrl} 
      productCount={productCount}
      followerCount={followerCount}
    />
  );
};

export default ShopItem;

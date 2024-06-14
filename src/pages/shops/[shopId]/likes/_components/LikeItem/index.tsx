import { useEffect, useState } from 'react';

import { getProduct } from '@/repository/products/getProduct';
import { TProduct } from '@/types';

import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/products/ProductCard/ProductCard';
import supabase from '@/lib/supabase/browserClient';

type LikeItemProps = {
  productId: string
}

const LikeItem = ({ productId }: LikeItemProps) => {
  const [ product, setProduct ] = useState<TProduct>()

  useEffect(() => {
    (async () => {
      const { data } = await getProduct(supabase, productId)

      setProduct(data)
    })()

  }, [productId])

  if (!product) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  return (
    <ProductCard 
      title={product.title}
      price={product.price}
      createdAt={product.createdAt}
      imageUrl={product.imageUrls[0]}
      isSoldOut={!!product.purchaseBy}
    />
  );
};

export default LikeItem;

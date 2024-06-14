import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase/browserClient";
import { getReviewByProductId } from "@/repository/reviews/getReviewByProductId";
import { PenIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type BuyProductListItemProps = {
  productId?: string
  imageUrl?: string
  title?: string
  price?: number
}

const BuyProductListItem = ({ productId, title, price, imageUrl }: BuyProductListItemProps) => {
  const [ isLoading, setIsLoading ] = useState(false)
  const [ hasReviewPosted, setHasReviewPosted ] = useState<boolean>(false)
  
  useEffect(() => { 
    (async () => {
      if (productId) {
        setIsLoading(true)
        const { data } = await getReviewByProductId(supabase, productId)
        setHasReviewPosted(!!data)
        setIsLoading(false)
      }
    })()
  }, [productId])

  return (
    <div className='flex text-center border-y my-4 py-2'>
      <div className='w-28 h-28'>
        <img src={imageUrl} title={title} className='w-full h-full' />
      </div>
      <div className='flex-1 flex items-center justify-center'>
        <Link href={`/products/${productId}`}>
          <span>{title}</span>
        </Link>
      </div>
      <div className='w-28 flex items-center justify-center'>
        <span>{price ? price.toLocaleString() : 0}원</span>
      </div>
      <div className='w-32 flex items-center justify-center'>
        <Link href={`/reviews/${productId}`}>
        {isLoading ? '로딩중' : (
          <Button 
            size={'sm'} 
            disabled={hasReviewPosted}
            className="flex items-center gap-x-1"
          >
            <PenIcon className="h-4 w-4"/>
            <span className="text-sm">후기작성</span>
          </Button>
        )}
        </Link>
      </div>
    </div>
  );
};

export default BuyProductListItem;

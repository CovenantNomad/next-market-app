import { Button } from '@/components/ui/button';
import { TProduct } from '@/types';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import Link from 'next/link';
import { deleteProduct } from '@/repository/products/deleteProduct';
import supabase from '@/lib/supabase/browserClient';

type ProductManageListItemProps = {
  product?: TProduct
}

dayjs.extend(relativeTime).locale('ko')

const ProductManageListItem = ({ product }: ProductManageListItemProps) => {

  const onDeleteProductHandler = async (productId: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        deleteProduct(supabase, productId)
      } catch (error) {
        alert('상품 삭제에 실패했습니다')
      } finally {
        window.location.reload()
      }
    }
  }

  if (!product) {
    return
  }

  return (
    <div className='flex text-center border-y my-4 py-2'>
      <div className='w-28 h-28'>
        <img src={product.imageUrls[0]} title={product.title} className='w-full h-full' />
      </div>
      <div className='w-28 flex items-center justify-center'>
        <span>{product.purchaseBy ? '판매완료' : '판매중'}</span>
      </div>
      <div className='flex-1 flex items-center justify-center'>
        <Link href={`/products/${product.id}`}>
          <span>{product.title}</span>
        </Link>
      </div>
      <div className='w-28 flex items-center justify-center'>
        <span>{product.price.toLocaleString()}</span>
      </div>
      <div className='w-28 flex items-center justify-center'>
        <span>{dayjs(product.createdAt).fromNow()}</span>
      </div>
      <div className='w-28'>
        <div className='h-full flex items-center justify-center gap-x-2'>
          <Link href={`/products/edit/${product.id}`}>
            <Button 
              size={'sm'}
              className='bg-orange-500'
            >
              수정
            </Button>
          </Link>
          <Button 
            size={'sm'}
            disabled={!!product.purchaseBy}
            onClick={() => onDeleteProductHandler(product.id)} 
            className='bg-red-500'
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductManageListItem;

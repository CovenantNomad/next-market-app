import CustomPagination from '@/components/common/CustomPagination/CustomPagination';
import ProductCard from '@/components/products/ProductCard/ProductCard';
import supabase from '@/lib/supabase/browserClient';
import { getShopProducts } from '@/repository/shops/getShopProducts';
import { TProduct } from '@/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type ProductTabProps = {
  shopId?: string
  initialProducts?: TProduct[]
  productCount?: number
}

const ProductTab = ({
  shopId,
  initialProducts = [],
  productCount = 0
}: ProductTabProps) => {
  //화면에 보이는 Page는 1부터 시작, API는 0부터 시작
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ products, setProducts ] = useState<TProduct[]>(initialProducts)


  useEffect(() => {
    if (!shopId) {
      return 
    }
    (async () => {
      // 페이지 바뀔때마다 데이터 받아오기
      const { data } = await getShopProducts(supabase, {
        shopId,
        // API 요청시에는 0부터 시작
        fromPage: currentPage - 1,
        toPage: currentPage
      })

      setProducts(data)
    })()

  }, [currentPage, shopId])

  return (
    <div>
      <div className='pt-10 pb-6'>
        <span>상품</span>
        <span className='inline-block ml-2 text-red-500'>{productCount.toLocaleString()}개</span>
      </div>
      <div>
        {products.length === 0 ? (
          <div>
            <span className='text-gray-500'>등록된 상품이 없습니다</span>
          </div>
        ) : (
          <div>
            <div className='w-full grid grid-cols-5 gap-4'>
              {products.map(({ id, title, price, imageUrls, createdAt, purchaseBy }) => (
                <Link key={id} href={`/products/${id}`}>
                  <ProductCard 
                    title={title}
                    price={price}
                    createdAt={createdAt}
                    imageUrl={imageUrls[0]}
                    isSoldOut={!!purchaseBy}
                  />
                </Link>
              ))}
            </div>
            <div className='flex justify-center mt-8'>
              <CustomPagination 
                currentPage={currentPage}
                total={productCount}
                onPageChangeHandler={(pageNumber) => setCurrentPage(pageNumber)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTab;

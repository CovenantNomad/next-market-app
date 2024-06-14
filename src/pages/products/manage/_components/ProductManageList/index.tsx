import ColdCaseMessageBox from '@/components/common/ColdCaseMessageBox';
import CustomPagination from '@/components/common/CustomPagination/CustomPagination';
import { getShopProducts } from '@/repository/shops/getShopProducts';
import { TProduct } from '@/types';
import React, { useEffect, useState } from 'react';
import ProductManageListItem from '../ProductManageListItem';
import supabase from '@/lib/supabase/browserClient';

type ProductManageListProps = {
  shopId: string
  initialProducts?: TProduct[]
  productCount: number
}

const ProductManageList = ({
  shopId,
  initialProducts = [],
  productCount
}: ProductManageListProps) => {
  const [ products, setProducts] = useState(initialProducts)
  const [ currentPage, setCurrentPage ] = useState(1)

  useEffect(() => {
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
      {products.length === 0 ? (
        <ColdCaseMessageBox 
          message='등록된 상품이 없습니다'
        />
      ) : (
        <div>
          {products.map((product) => (
            <ProductManageListItem 
              key={product.id}
              product={product}
            />
          ))}
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
  );
};

export default ProductManageList;

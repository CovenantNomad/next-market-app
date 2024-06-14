import ColdCaseMessageBox from "@/components/common/ColdCaseMessageBox";
import CustomPagination from "@/components/common/CustomPagination/CustomPagination";
import { getShopProducts } from "@/repository/shops/getShopProducts";
import { TProduct } from "@/types";
import { useEffect, useState } from "react";
import SellProductListItem from "../SellProductListItem";
import supabase from "@/lib/supabase/browserClient";
import { getShopSellProducts } from "@/repository/shops/getShopSellProducts";

type SellProductListProps = {
  shopId: string
  initialSellProducts?: TProduct[]
  productCount: number
}

const SellProductList = ({ shopId, initialSellProducts = [], productCount }: SellProductListProps) => {
  const [ products, setProducts] = useState(initialSellProducts)
  const [ currentPage, setCurrentPage ] = useState(1)


  useEffect(() => {
    (async () => {
      // 페이지 바뀔때마다 데이터 받아오기
      const { data } = await getShopSellProducts(supabase, {
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
          message='판매한 상품이 없습니다'
        />
      ) : (
        <div>
          {products.map((product) => (
            <SellProductListItem 
              key={product.id}
              productId={product.id}
              imageUrl={product.imageUrls[0]}
              title={product.title}
              price={product.price}
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

export default SellProductList;

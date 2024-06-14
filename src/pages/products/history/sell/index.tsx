import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getProduct } from "@/repository/products/getProduct";
import { TProduct } from "@/types";
import ProductHistoryTabs from "../_components/ProductHistoryTabs";
import ProductsLayout from "../../_components/ProductsLayout";
import Container from "@/components/layout/Container/Container";
import SellProductList from "./_components/SellProductList";
import { getMe } from "@/repository/me/getMe";
import { getShopSellProducts } from "@/repository/shops/getShopSellProducts";
import { getShopInfomation } from "@/repository/shops/getShopInfomation";
import { AuthError } from "@/lib/error";
import getServerSupabase from "@/lib/supabase/serverClient";


const ProductSellHistoryPage = ({
  shopId,
  products: initialSellProudcts,
  sellProductCount
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  
  return (
    <ProductsLayout>
      <Container>
        <ProductHistoryTabs 
          currentTab='sell'
        />
        <div className="pb-12">
          <div className='flex text-center border-y border-black py-2'>
            <span className='w-28'>사진</span>
            <span className='flex-1'>상품명</span>
            <span className='w-28'>가격</span>
          </div>
          <SellProductList
            initialSellProducts={initialSellProudcts}
            productCount={sellProductCount}
            shopId={shopId}
          />
        </div>
      </Container>
    </ProductsLayout>
  );
};

export default ProductSellHistoryPage;


export const getServerSideProps: GetServerSideProps<{
  shopId: string
  products: TProduct[]
  sellProductCount: number
}> = async (context) => {
  try {
    const supabase = getServerSupabase(context)
    const { data: { shopId }} = await getMe(supabase)

    if (!shopId) {
      throw new AuthError('로그인이 필요합니다')
    }

    const [
      { data: products },
      { data: { sellProductCount }}
    ] = await Promise.all([
      getShopSellProducts(supabase, { shopId: shopId, fromPage: 0, toPage: 1 }),
      getShopInfomation(supabase, shopId)
    ])

    return {
      props: {
        shopId,
        products,
        sellProductCount,
      }
    }
    
  } catch (e) {
    if (e instanceof AuthError) {
      return {
        redirect: {
          destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false
        }
      }
    }
    throw e
  }
}
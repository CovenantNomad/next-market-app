import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { TProduct } from "@/types";
import ProductHistoryTabs from "../_components/ProductHistoryTabs";
import ProductsLayout from "../../_components/ProductsLayout";
import Container from "@/components/layout/Container/Container";
import { getMe } from "@/repository/me/getMe";
import { getShopInfomation } from "@/repository/shops/getShopInfomation";
import BuyProductList from "./_components/BuyProductList";
import { getShopBuyProducts } from "@/repository/shops/getShopBuyProducts";
import { AuthError } from "@/lib/error";
import getServerSupabase from "@/lib/supabase/serverClient";


const ProductBuyHistoryPage = ({
  shopId,
  products: initialBuyProudcts,
  buyProductCount
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  
  return (
    <ProductsLayout>
      <Container>
        <ProductHistoryTabs 
          currentTab='buy'
        />
        <div className="pb-12">
          <div className='flex text-center border-y border-black py-2'>
            <span className='w-28'>사진</span>
            <span className='flex-1'>상품명</span>
            <span className='w-28'>가격</span>
            <span className='w-32'>기능</span>
          </div>
          <BuyProductList
            initialBuyProudcts={initialBuyProudcts}
            productCount={buyProductCount}
            shopId={shopId}
          />
        </div>
      </Container>
    </ProductsLayout>
  );
};

export default ProductBuyHistoryPage;


export const getServerSideProps: GetServerSideProps<{
  shopId: string
  products: TProduct[]
  buyProductCount: number
}> = async (context) => {
  try {
    const supabase = getServerSupabase(context)
    const { data: { shopId }} = await getMe(supabase)

    if (!shopId) {
      throw new AuthError('로그인이 필요합니다')
    }

    const [
      { data: products },
      { data: { buyProductCount }}
    ] = await Promise.all([
      getShopBuyProducts(supabase, { shopId: shopId, fromPage: 0, toPage: 1 }),
      getShopInfomation(supabase, shopId)
    ])

    return {
      props: {
        shopId,
        products,
        buyProductCount,
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
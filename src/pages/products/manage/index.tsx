import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
//logic
import { TProduct } from '@/types';
import { getMe } from '@/repository/me/getMe';
import { getShopProducts } from '@/repository/shops/getShopProducts';
import { getShopInfomation } from '@/repository/shops/getShopInfomation';
//components
import Container from '@/components/layout/Container/Container';
import ProductsLayout from '../_components/ProductsLayout';
import ProductManageList from './_components/ProductManageList';
import { AuthError } from '@/lib/error';
import getServerSupabase from '@/lib/supabase/serverClient';


const ProductManagePage = ({
  shopId,
  products: initialProudcts,
  productCount
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  return (
    <ProductsLayout 
      currentTabs="manage"
    >
      <Container>
        <div className='py-10'>
          <div className='flex text-center border-y border-black py-2'>
            <span className='w-28'>사진</span>
            <span className='w-28'>판매상태</span>
            <span className='flex-1'>상품명</span>
            <span className='w-28'>가격</span>
            <span className='w-28'>등록시간</span>
            <span className='w-28'>기능</span>
          </div>
          <ProductManageList
            initialProducts={initialProudcts}
            productCount={productCount}
            shopId={shopId}
          />
        </div>
      </Container>
    </ProductsLayout>
  );
};

export default ProductManagePage;


export const getServerSideProps: GetServerSideProps<{
  products: TProduct[]
  productCount: number
  shopId: string
}> = async (context) => {
  try {
    const supabase = getServerSupabase(context)
    const { data: { shopId }} = await getMe(supabase)

    if (!shopId) {
      throw new AuthError('로그인이 필요합니다')
    }

    const [
      { data: products },
      { data: { productCount }}
    ] = await Promise.all([
      getShopProducts(supabase, { shopId, fromPage:0, toPage: 1 }),
      getShopInfomation(supabase, shopId)
    ])

    return {
      props: {
        shopId,
        products,
        productCount,
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
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { getShop } from '@/repository/shops/getShop';
import { getShopInfomation } from '@/repository/shops/getShopInfomation';
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount';

import { TProduct, TShop } from '@/types';

import ShopLayout from '../../_components/ShopLayout';
import { getShopProducts } from '@/repository/shops/getShopProducts';
import ProductTab from './_components/ProductTab';
import { getMe } from '@/repository/me/getMe';
import getServerSupabase from '@/lib/supabase/serverClient';


const ShopProductsPage = ({ 
  isMyShop,
  shop,
  products,
  productCount,
  reviewCount,
  followerCount,
  followingCount,
  likeCount
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  return (
    <ShopLayout 
      isMyShop={isMyShop}
      shop={shop}
      productCount={productCount}
      reviewCount={reviewCount}
      followerCount={followerCount}
      followingCount={followingCount}
      likeCount={likeCount}
      currentTab={'products'}
    >
      <ProductTab 
        shopId={shop.id}
        initialProducts={products}
        productCount={productCount}
      />
    </ShopLayout>
  );
};

export default ShopProductsPage;


export const getServerSideProps: GetServerSideProps<{
  isMyShop: boolean
  shop: TShop
  products: TProduct[]
  productCount: number
  reviewCount: number
  followerCount: number
  followingCount: number
  likeCount: number
}> = async (context) => {
  const supabase = getServerSupabase(context)
  const shopId = context.query.shopId as string

  const [
    { data: { shopId: myShopId } },
    { data: shop },
    { data: { 
      productCount, 
      reviewCount, 
      followerCount, 
      followingCount 
    }}, 
    { data: likeCount },
    { data: products }
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopInfomation(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopProducts(supabase, { shopId, fromPage: 0, toPage: 1})
  ])

  return {
    props: {
      isMyShop: myShopId === shop.id,
      shop,
      products,
      productCount,
      reviewCount,
      followerCount,
      followingCount,
      likeCount,
    }
  }
}
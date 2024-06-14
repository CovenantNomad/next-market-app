import ShopLayout from '../../_components/ShopLayout';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { TReview, TShop } from '@/types';
import { getShop } from '@/repository/shops/getShop';
import { getShopInfomation } from '@/repository/shops/getShopInfomation';
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount';
import { getShopReviews } from '@/repository/shops/getShopReviews';
import ReviewTab from './_components/ReviewTab';
import { getMe } from '@/repository/me/getMe';
import getServerSupabase from '@/lib/supabase/serverClient';


const ShopReviewPage = ({ 
  isMyShop,
  shop,
  reviews,
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
      currentTab={'reviews'}
    >
      <ReviewTab 
        shopId={shop.id}
        initialReviews={reviews}
        reviewCount={reviewCount}
      />
    </ShopLayout>
  );
};

export default ShopReviewPage;


export const getServerSideProps: GetServerSideProps<{
  isMyShop: boolean
  shop: TShop
  reviews: TReview[]
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
    { data: reviews }
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopInfomation(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopReviews(supabase, { shopId, fromPage: 0, toPage: 1 })
  ])

  return {
    props: {
      isMyShop: myShopId === shop.id,
      shop,
      reviews,
      productCount,
      reviewCount,
      followerCount,
      followingCount,
      likeCount,
    }
  }
}
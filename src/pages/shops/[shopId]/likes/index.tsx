import ShopLayout from '../../_components/ShopLayout';
import LikeTab from './_components/LikeTab';
import { getShop } from '@/repository/shops/getShop';
import { getShopInfomation } from '@/repository/shops/getShopInfomation';
import { getShopLikeCount } from '@/repository/shops/getShopLikeCount';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { TLike, TShop } from '@/types';
import { getShopLikes } from '@/repository/shops/getShopLikes';
import { getMe } from '@/repository/me/getMe';
import getServerSupabase from '@/lib/supabase/serverClient';


const ShopLikesPage = ({
  isMyShop,
  shop,
  likes,
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
      currentTab={'likes'}
    >
      <LikeTab 
        shopId={shop.id}
        initialLikes={likes}
        LikeCount={likeCount}
      />
    </ShopLayout>
  );
};

export default ShopLikesPage;


export const getServerSideProps: GetServerSideProps<{
  isMyShop: boolean
  shop: TShop
  likes: TLike[]
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
    { data: likes }
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopInfomation(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopLikes(supabase, { shopId, fromPage: 0, toPage: 1 })
  ])

  return {
    props: {
      isMyShop: myShopId === shop.id,
      shop,
      likes,
      productCount,
      reviewCount,
      followerCount,
      followingCount,
      likeCount,
    }
  }
}
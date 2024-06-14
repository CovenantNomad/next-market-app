import ShopLayout from "../../_components/ShopLayout";
import FollowingTab from "./_components/FollowingTab";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { TFollow, TShop } from "@/types";
import { getShop } from "@/repository/shops/getShop";
import { getShopInfomation } from "@/repository/shops/getShopInfomation";
import { getShopLikeCount } from "@/repository/shops/getShopLikeCount";
import { getShopReviews } from "@/repository/shops/getShopReviews";
import { getShopFollowings } from "@/repository/shops/getShopFollowing";
import { getMe } from "@/repository/me/getMe";
import getServerSupabase from "@/lib/supabase/serverClient";


const ShopFollowingPage = ({ 
  isMyShop,
  shop,
  followings,
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
      currentTab={'followings'}
    >
      <FollowingTab 
        shopId={shop.id}
        initialFollowing={followings}
        followingCount={followingCount}
      />
    </ShopLayout>
  );
};

export default ShopFollowingPage;

export const getServerSideProps: GetServerSideProps<{
  isMyShop: boolean
  shop: TShop
  followings: TFollow[]
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
    { data: followings },
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopInfomation(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopFollowings(supabase, { shopId, fromPage: 0, toPage: 1 })
  ])

  return {
    props: {
      isMyShop: myShopId === shop.id,
      shop,
      followings,
      productCount,
      reviewCount,
      followerCount,
      followingCount,
      likeCount,
    }
  }
}

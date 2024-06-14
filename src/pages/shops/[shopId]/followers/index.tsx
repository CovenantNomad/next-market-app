import ShopLayout from "../../_components/ShopLayout";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { TFollow, TShop } from "@/types";
import { getShop } from "@/repository/shops/getShop";
import { getShopInfomation } from "@/repository/shops/getShopInfomation";
import { getShopLikeCount } from "@/repository/shops/getShopLikeCount";
import { getShopFollowers } from "@/repository/shops/getShopFollowers";
import FollowerTab from "./_components/FollowerTab";
import { getMe } from "@/repository/me/getMe";
import getServerSupabase from "@/lib/supabase/serverClient";


const ShopFollowerPage = ({
  isMyShop, 
  shop,
  followers,
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
      currentTab={'followers'}
    >
      <FollowerTab 
        shopId={shop.id}
        initialFollower={followers}
        followerCount={followerCount}
      />
    </ShopLayout>
  );
};

export default ShopFollowerPage;

export const getServerSideProps: GetServerSideProps<{
  isMyShop: boolean
  shop: TShop
  followers: TFollow[]
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
    { data: followers },
  ] = await Promise.all([
    getMe(supabase),
    getShop(supabase, shopId),
    getShopInfomation(supabase, shopId),
    getShopLikeCount(supabase, shopId),
    getShopFollowers(supabase, { shopId, fromPage: 0, toPage: 1 })
  ])

  return {
    props: {
      isMyShop: myShopId === shop.id,
      shop,
      followers,
      productCount,
      reviewCount,
      followerCount,
      followingCount,
      likeCount,
    }
  }
}

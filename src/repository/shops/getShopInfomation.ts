import { SupabaseClient } from "@supabase/supabase-js"


export async function getShopInfomation(supabase: SupabaseClient, shopId: string): Promise<{ 
  data: { 
    productCount: number, 
    reviewCount: number 
    followerCount: number,
    followingCount: number,
    sellProductCount: number, 
    buyProductCount: number 
  } 
}> {
  if (process.env.USE_MOCK_DATA === 'true') {
    return { 
      data: { 
        productCount: Math.floor(Math.random()*1000),
        reviewCount: Math.floor(Math.random()*1000), 
        followerCount: Math.floor(Math.random()*1000), 
        followingCount: Math.floor(Math.random()*1000),
        sellProductCount: Math.floor(Math.random()*1000),
        buyProductCount: Math.floor(Math.random()*1000),
      } 
    }
  }

  const [
    { count: productCount, error: productError },
    { count: reviewCount, error: reviewError },
    { count: followerCount, error: followerError },
    { count: followingCount, error: followingError },
    { count: sellProductCount, error: sellProductError },
    { count: buyProductCount, error: buyProductError },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('created_by', shopId),
    supabase.from('reviews').select('*, product_id!inner(created_by)', { count: 'exact', head: true}).eq('product_id.created_by', shopId),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_shop_id', shopId),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('created_by', shopId),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('created_by', shopId).not('purchase_by', 'is', null),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('purchase_by', shopId),
  ])

  if (productError) {
    console.log('상품에러')
    throw productError
  }

  if (reviewError) {
    console.log('리뷰에러')
    throw reviewError
  }

  if (followerError) {
    console.log('팔로워에러')
    throw followerError
  }

  if (followingError) {
    console.log('팔로잉에러')
    throw followingError
  }

  if (sellProductError) {
    console.log('판매에러')
    throw sellProductError
  }

  if (buyProductError) {
    console.log('구입에러')
    throw buyProductError
  }


  return { data: {
    productCount: productCount || 0,
    reviewCount: reviewCount || 0,
    followerCount: followerCount || 0,
    followingCount: followingCount || 0,
    sellProductCount: sellProductCount || 0,
    buyProductCount: buyProductCount || 0,
  }}
}
import { TReview } from "@/types";
import { SupabaseClient } from '@supabase/supabase-js';
import camelcaseKeys from "camelcase-keys";

type Params = {
  shopId: string;
  fromPage?: number;
  toPage?: number;
}

export async function getShopReviews (
  supabase: SupabaseClient,
  { 
    shopId, 
    fromPage = 0, 
    toPage = 1
  }: Params
): Promise<{ data: TReview[]}> {
  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockReviewData } = await import("@/lib/mock")
    const data: TReview[] = Array.from({ length: (toPage - fromPage) * 10}).map(() => 
      getMockReviewData({ createdBy: shopId })
    )
  
    return { data }
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*, product_id, product:product_id!inner(created_by)')
    .eq('product.created_by', shopId)
    .range((fromPage ?? 0) * 10, (toPage ?? 1) * 10 -1)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return { data: camelcaseKeys(data, { deep: true })}
}
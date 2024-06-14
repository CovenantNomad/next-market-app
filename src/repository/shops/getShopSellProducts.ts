import { TProduct } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

type Param = {
  shopId: string;
  fromPage?: number;
  toPage?: number;
}

export async function getShopSellProducts(
  supabase: SupabaseClient,
  {
    shopId, 
    fromPage = 0, 
    toPage = 1
  }: Param
): Promise<{ data : TProduct[]}> {
  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockProductData } = await import("@/lib/mock")
    const data: TProduct[] = Array.from({ length: (toPage - fromPage) * 10}).map(() => 
      getMockProductData({ 
        createdBy: shopId,  
        purchaseBy: 'mock-shopId'
      })
    )
  
    return { data }
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('created_by', shopId)
    .not('purchase_by', 'is', null)
    .range((fromPage ?? 0) * 10, (toPage ?? 1) * 10 -1)
    .order('created_at', { ascending: false })
 
  if (error) {
    throw error
  }

  return { data: camelcaseKeys(data, { deep: true })}
}
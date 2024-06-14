import { SupabaseClient } from "@supabase/supabase-js";
import { TShop } from "@/types";
import camelcaseKeys from "camelcase-keys";

export async function getShop(
  supabase: SupabaseClient,
  shopId: string
): Promise<{data: TShop}> {
  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockShopData } = await import('@/lib/mock')
    const data: TShop = getMockShopData({ id: shopId })

    return { data }
  }
  
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', shopId)
    .limit(1)
    .single()
  
  if (error) {
    throw error
  }

  return { data: camelcaseKeys(data) }
}
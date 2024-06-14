import { TShop } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

type Params = {
  query: string;
  fromPage?: number;
  toPage?: number;
}

export async function getShopByKeyword(
  supabase: SupabaseClient,
  { query, fromPage = 0, toPage = 1}: Params
): Promise<{ data: TShop[] }> {

  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockShopData } = await import("@/lib/mock")
    const data: TShop[] = Array.from({length: (toPage - fromPage) * 10}).map((_, index) => 
      getMockShopData({
        name: `${query} - ${index}`
      })
    )
  
    return { data }
  }

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .like('name', `%${query}%`)
    .range((fromPage ?? 0) * 10, (toPage ?? 1) * 10 - 1)

  if (error) {
    throw error
  }

  return { data: camelcaseKeys(data, { deep: true })}
}
import { TProduct } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

type Params = {
  query: string;
  fromPage?: number;
  toPage?: number;
}

export async function getProductByKeyword(
  supabase: SupabaseClient,
  { query, fromPage = 0, toPage = 1}: Params
): Promise<{ data: TProduct[] }> {

  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockProductData } = await import("@/lib/mock")
    const data: TProduct[] = Array.from({ length: (toPage - fromPage) * 10}).map((_, index) => 
      getMockProductData({
        title: `${query} - ${index}`
      })
    )
  
    return { data }
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .like('title', `%${query}%`)
    .is('purchase_by', null)
    .range((fromPage ?? 0) * 10, (toPage ?? 1) * 10 -1)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return { data: camelcaseKeys(data, { deep: true })}
}
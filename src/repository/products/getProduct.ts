import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import { TProduct } from "@/types";

export async function getProduct(supabase: SupabaseClient, id: string): Promise<{data: TProduct}> {
  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockProductData } = await import("@/lib/mock")
    const data: TProduct = getMockProductData()

    return { data }
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .limit(1)
    .single()
  
  if (error) {
    throw error
  }

  return { data: camelcaseKeys(data, { deep: true })}
}
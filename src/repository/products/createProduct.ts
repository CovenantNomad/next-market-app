import { TProduct } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

type Params = Omit<Omit<Omit<Omit<TProduct, 'id'>, 'createdAt'>, 'createdBy'>, 'purchaseBy'>

export async function createProduct(
  supabase: SupabaseClient,
  params : Params
): Promise<{ data: TProduct }> {
  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockProductData } = await import('@/lib/mock')
    return { data: getMockProductData()}
  }

  const { data, error } = await supabase
    .from('products')
    .insert(snakecaseKeys(params))
    .select()
    .single()

  if (error) {
    throw error
  }

  return {data: camelcaseKeys(data, { deep: true })}
}
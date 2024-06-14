import { TProduct } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

type Params = Omit<Omit<Omit<TProduct, 'createdAt'>, 'createdBy'>, 'purchaseBy'>

export async function updateProduct(
  supabase: SupabaseClient,
  params : Params
): Promise<{ data: TProduct }> {
  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockProductData } = await import('@/lib/mock')
    return { data: getMockProductData({ id: params.id })}
  }

  const { data, error } = await supabase
    .from('products')
    .update(snakecaseKeys(params))
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return {data: camelcaseKeys(data, { deep: true })}
}
import { SupabaseClient } from "@supabase/supabase-js";

export async function getProductByKeywordCount(
  supabase: SupabaseClient, 
  query: string
): Promise<{ data: number }> {
  if (process.env.USE_MOCK_DATA === 'true') {
    return { data: 100 }
  }

  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .like('title', `%${query}%`)
    .is('purchase_by', null)
  
  if (error) {
    throw error
  }

  return { data: count || 0 }
}
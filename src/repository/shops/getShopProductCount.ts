import { SupabaseClient } from "@supabase/supabase-js"


export async function getShopProductCount(supabase: SupabaseClient, shopId: string): Promise<{ 
  data: number
}> {
  if (process.env.USE_MOCK_DATA === 'true') {
    return { 
      data: Math.floor(Math.random()*1000)
    }
  }

  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', shopId)

  if (error) {
    throw error
  }

  return { data: count || 0}
}
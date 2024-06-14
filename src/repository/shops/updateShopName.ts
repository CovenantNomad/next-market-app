import { SupabaseClient } from "@supabase/supabase-js"

type Param = {
  shopId: string
  name: string
}

export async function updateShopName(supabase: SupabaseClient, { shopId, name }: Param) {
  if (process.env.USE_MOCK_DATA === 'true') {
    return
  }

  const { error } = await supabase.from('shops').update({ name }).eq('id', shopId)

  if (error) {
    throw error
  }

  return
}
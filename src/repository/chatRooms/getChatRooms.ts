import { TChatRoom } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

export async function getChatRooms(
  supabase: SupabaseClient,
  shopId: string
): Promise<{
  data: TChatRoom[]
}> {
  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockChatRoomData } = await import("@/lib/mock")
    const data: TChatRoom[] = Array.from({ length: 1000 }).map(() => 
      getMockChatRoomData({ toShopId: shopId })
    )
  
    return { data }
  }

  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*')
    .or(`from_shop_id.eq.${shopId}, to_shop_id.eq.${shopId}`)

  if (error) {
    throw error
  }

  return { data: camelcaseKeys(data, { deep: true }) }
}
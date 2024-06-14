import { getImageUrl } from "@/lib/image";
import { SupabaseClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

export async function uploadImage(
  supabase: SupabaseClient,
  imageFile: File
): Promise<{ data: { imageUrl: string }}> {
  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockImageDataUri } = await import('@/lib/mock')
    return { data: { imageUrl: getMockImageDataUri() }}
  }

  const { data, error } = await supabase.storage
    .from('next-market-app')
    .upload(
      `${nanoid()}.${
        imageFile.type === 'image/webp' 
        ? 'webp' 
        : imageFile.type === 'image/png' 
        ? 'png'
        : imageFile.type === 'image/jpeg' 
        ? 'jpeg'
        : 'jpg'}`,
      imageFile
    )
  
  if (error) {
    throw error
  }

  const imageUrl = await getImageUrl('next-market-app', data.path)

  return { data: { imageUrl }}
}
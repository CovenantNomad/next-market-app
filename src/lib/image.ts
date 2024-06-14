import supabase from "./supabase/browserClient"

export function checkIsImage(str: string) {
  return /^data:image/.test(str) || /^https:\/\//.test(str)
}

export async function getImageUrl(bucketName: string, fileName: string) {
  //방어코드 (fileName으로 풀경로가 들어올수도 있으므로)
  if (fileName.startsWith('http')) {
    return fileName
  }

  const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName)

  return publicUrl
}


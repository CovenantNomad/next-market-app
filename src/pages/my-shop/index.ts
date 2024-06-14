import { AuthError } from "@/lib/error"
import getServerSupabase from "@/lib/supabase/serverClient"
import { getMe } from "@/repository/me/getMe"
import { GetServerSideProps } from "next"

export default function MyShopPage() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const supabase = getServerSupabase(context)
    const { data: { shopId }} = await getMe(supabase)

    if (shopId === null) {
      throw new AuthError('로그인이 필요합니다')
    }
  
    return {
      redirect: {
        destination: `/shops/${shopId}`,
        permanent: false
      }
    } 
  } catch (e) {
    if (e instanceof AuthError) {
      return {
        redirect: {
          destination: `/login?next=${encodeURIComponent('/my-shop')}`,
          permanent: false
        }
      }
    }
    throw e
  }
}
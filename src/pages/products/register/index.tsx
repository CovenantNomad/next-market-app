import { GetServerSideProps } from "next";
import ProductForm from "../_components/ProductForm";
import { getMe } from "@/repository/me/getMe";
import { AuthError } from "@/lib/error";
import getServerSupabase from "@/lib/supabase/serverClient";

const ProductRegisterPage = () => {
  return <ProductForm />
};

export default ProductRegisterPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const supabase = getServerSupabase(context)
    const { data: { shopId }} = await getMe(supabase)

    if (shopId === null) {
      throw new AuthError('로그인이 필요합니다')
    }
  
    return {
      props: {}
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
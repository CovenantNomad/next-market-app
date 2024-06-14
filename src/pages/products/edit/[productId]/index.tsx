import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getProduct } from "@/repository/products/getProduct";
import { TProduct } from "@/types";
import { TCity } from "@/lib/address";
import ProductForm from "../../_components/ProductForm";
import { getMe } from "@/repository/me/getMe";
import { AuthError } from "@/lib/error";
import getServerSupabase from "@/lib/supabase/serverClient";


const ProductEditPage = ({ product }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [ city, district ] = product.address.split(' ')
  
  return (
    <ProductForm 
      id={product.id}
      imageUrls={product.imageUrls}
      title={product.title}
      isUsed={product.isUsed}
      isChangeable={product.isChangeable}
      price={product.price}
      city={city as TCity}
      district={district}
      description={product.description}
      tags={product.tags || undefined}
    />
  );
};

export default ProductEditPage;


export const getServerSideProps: GetServerSideProps<{
  product: TProduct
}> = async (context) => {
  try {
    const supabase = getServerSupabase(context)
    const { data: { shopId }} = await getMe(supabase)

    if (shopId === null) {
      throw new AuthError('로그인이 필요합니다')
    }
    const productId = context.query.productId as string
  
    const { data: product } = await getProduct(supabase, productId)
  
    return {
      props: {
        product
      }
    }

  } catch (e) {
    if (e instanceof AuthError) {
      return {
        redirect: {
          destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false
        }
      }
    }
    throw e
  
  }
}
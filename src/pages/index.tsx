import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import MainBanner from "./_components/MainBanner";
import ProductList from "./_components/ProductList/ProductList";

import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container/Container";

import { getProducts } from "@/repository/products/getProducts";
import getServerSupabase from "@/lib/supabase/serverClient";
import { TProduct } from "@/types";


export default function Home({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  
  return (
    <MainLayout>
      <Container>
        <MainBanner />
        <ProductList initialProducts={products} />
      </Container>
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{ products: TProduct[] }> = async (context) => {
  const supabase = getServerSupabase(context)
  const { data }  = await getProducts(supabase, { fromPage: 0, toPage: 3 })

  return {
    props: { products: data }
  }
}
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container/Container";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getProductByKeyword } from "@/repository/products/getProductByKeyword";
import { TProduct } from "@/types";
import ProductCard from "@/components/products/ProductCard/ProductCard";
import CustomPagination from "@/components/common/CustomPagination/CustomPagination";
import { getProductByKeywordCount } from "@/repository/products/getProductByKeywordCount";
import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase/browserClient";
import getServerSupabase from "@/lib/supabase/serverClient";


export default function SearchPage({ products: initialProducts, query, total } : InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [ products, setProducts ] = useState<TProduct[]>(initialProducts)
  // 사용자에게 보이는 페이지는 1부터 시작
  const [ currentPage, setCurrentPage ] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [initialProducts])

  useEffect(() => {
    (async () => {
      const { data: products } = await getProductByKeyword(supabase, {
        query,
        // 서버에서 처리되는 페이지는 0부터 시작
        fromPage: currentPage - 1,
        toPage: currentPage
      })
      setProducts(products)
    })()
  }, [currentPage, query])

  return (
    <MainLayout>
      <Container>
        <div className="py-7">
          <p className="text-lg">
            <span className="text-red-500">{query}</span>
            의 검색결과
          </p>
        </div>
        {products.length === 0 ? (
          <div className="flex justify-center py-10">
            <span>검색결과가 없습니다</span>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-5 gap-4 py-10">
              {products?.map(({ id, title, imageUrls, price, createdAt, purchaseBy }) =>
                <Link key={id} href={`/products/${id}`}>
                  <ProductCard
                    title={title} 
                    imageUrl={imageUrls[0]} 
                    price={price} 
                    createdAt={createdAt}
                    isSoldOut={purchaseBy ? true : false}
                  />
                </Link> 
              )}
            </div>
            <div className="flex justify-center mt-8">
              <CustomPagination
                currentPage={currentPage}
                total={total}
                onPageChangeHandler={(pageNumber) => setCurrentPage(pageNumber)}
              />
            </div>
          </div>
        )}
      </Container>
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  products: TProduct[]
  query: string
  total: number
}> = async (context) => {
  const supabase = getServerSupabase(context)
  const originalQuery = context.query.query as string | undefined

  if (!originalQuery) {
    throw new Error("검색어가 없습니다")
  }

  const query = decodeURIComponent(originalQuery)

  const [{ data: products }, { data: total }] = await Promise.all([
    getProductByKeyword(supabase, {
      query,
      fromPage: 0,
      toPage: 1
    }),
    getProductByKeywordCount(supabase, query)
  ])

  return { props : { products, query, total }}
}
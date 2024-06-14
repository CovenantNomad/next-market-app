import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { TShop } from "@/types";
import { getShopByKeyword } from "@/repository/shops/getShopByKeyword";
import { getShopByKeywordCount } from "@/repository/shops/getShopByKeywordCount";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container/Container";
import CustomPagination from "@/components/common/CustomPagination/CustomPagination";
import ShopItem from "@/components/shops/ShopItem";
import Link from "next/link";
import supabase from "@/lib/supabase/browserClient";
import getServerSupabase from "@/lib/supabase/serverClient";


export default function SearchShopPage({ shops: initialShops, query, total } : InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [ shops, setShops ] = useState<TShop[]>(initialShops)
  const [ currentPage, setCurrentPage ] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [initialShops])

  useEffect(() => {
    (async () => {
      const { data: shops } = await getShopByKeyword(supabase, {
        query,
        // 서버에서 처리되는 페이지는 0부터 시작
        fromPage: currentPage - 1,
        toPage: currentPage
      })
      setShops(shops)
    })()
  }, [currentPage, query])

  return (
    <MainLayout>
      <Container>
        <div className="py-8">
          <p className="text-lg">
            검색결과
            <span className="text-gray-500 ml-2">{total.toLocaleString()}개</span>
          </p>
        </div>
        {shops.length === 0 ? (
          <div className="flex justify-center py-10">
            <span>검색결과가 없습니다</span>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-y-4 py-4">
              {shops.map(({ id, name, imageUrl }) => 
                <Link key={id} href={`/shops/${id}`}>
                  <ShopItem
                    id={id}
                    name={name} 
                    profileImageUrl={imageUrl} 
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
  shops: TShop[]
  query: string
  total: number
}> = async (context) => {
  const supabase = getServerSupabase(context)
  const originalQuery = context.query.query as string | undefined

  if (!originalQuery) {
    throw new Error("검색어가 없습니다")
  }

  const query = decodeURIComponent(originalQuery)

  const [ { data: shops }, { data: total } ] = await Promise.all([
    getShopByKeyword(supabase, {
      query,
      fromPage: 0,
      toPage: 1
    }),
    getShopByKeywordCount(supabase, query)
  ])

  return { props : { shops, query, total }}
}
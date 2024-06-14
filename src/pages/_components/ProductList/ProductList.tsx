import ProductCard from "@/components/products/ProductCard/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import supabase from "@/lib/supabase/browserClient";
import { getProducts } from "@/repository/products/getProducts";
import { TProduct } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";


type ProductListProps = {
  initialProducts?: TProduct[]
}

const ProductList = ({ initialProducts = [] }: ProductListProps) => {
  const limitProducts = 100
  const [ products, setProducts ] = useState<TProduct[]>(initialProducts)
  // 기본 3페이지까지 로드
  const [ page, setPage ] = useState<number>(3)
  const { inView, ref } = useInView({
    threshold: 1.0
  })
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  // 더이상 데이터가 없는데, API를 계속 보내게 된다.
  const [ isLastPage, setIsLastPage ] = useState(false)

  // 추상화
  const getProductsHandler = async ({ fromPage, toPage } : { fromPage: number, toPage: number }) => {
    try {
      setIsLoading(true)
      // 데이터를 까서 리턴
      const { data } = await getProducts(supabase, { fromPage, toPage })
      return data

    } catch (error) {
      throw error

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (inView) {
      //inView가 true가 되면 새로운 페이지의 데이터를 불러온다.
      (async () => {
        const data = await getProductsHandler({ fromPage: page, toPage: page + 1 })
        if (data.length === 0) {
          setIsLastPage(true)
          return 
        }
        // 기존데이터 + 새로운 데이터
        setProducts((products) => [...products, ...data])
        setPage(page + 1)
      })()
    }
  }, [inView])

  return (
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
      { 
        isLoading && (
          <>
            {Array.from({ length: 10 }).map((_, index) => 
              <Skeleton key={index} className="h-[224px] rounded-lg" />
            )}
          </>
        )
      }
      {!isLastPage && products.length > 0 && products.length < limitProducts && (
        <div ref={ref} className="w-full h-[50px]" />
      )}
    </div>
  );
};

export default ProductList;

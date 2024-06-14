import { Skeleton } from '@/components/ui/skeleton';
import { RECENT_ITEM_IDS_KEY, getRecentItems } from '@/lib/localStorage';
import { getProduct } from '@/repository/products/getProduct';
import { TProduct } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import RecentItemDetail from './_components/RecentItemDetail';
import supabase from '@/lib/supabase/browserClient';

type RecentItemProps = {}

const RecentItem = ({}: RecentItemProps) => {
  const [ isLoading, setIsLoading ] = useState(false)
  const [ recentProducts, setRecentProducts ] = useState<TProduct[]>([])
  const [ currentPage, setCurrentPage ] = useState(0)
  const totalPage = useMemo(() => Math.max(Math.ceil(recentProducts.length / 3) - 1, 0), [recentProducts])

  const onUpdateRecentProductsHandler = useCallback(async () => {
    try {
      setIsLoading(true)
      const recentIds = getRecentItems()
      const result = await Promise.all(
        recentIds.map(productId => getProduct(supabase, productId))
      )

      const products = result.map(({ data }) => data)
      setRecentProducts(products)

    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    onUpdateRecentProductsHandler()

  }, [onUpdateRecentProductsHandler])

  useEffect(() => {
    const eventHandler = () => onUpdateRecentProductsHandler()
    window.addEventListener(RECENT_ITEM_IDS_KEY, eventHandler)

    return () => window.removeEventListener(RECENT_ITEM_IDS_KEY, eventHandler)

  }, [])

  useEffect(() => {
    setCurrentPage((_curPage) => Math.min(_curPage, totalPage))
  }, [totalPage])

  return (
    <div className='flex flex-col items-center border border-gray-300 p-2 mt-2'>
      <span className='text-xs'>최근 본 상품</span>
      <div className='mt-2 text-center'>
        {isLoading ? (
          <div className='w-full'>
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <>
            {recentProducts.length === 0 ? (
              <span className='text-xs text-gray-500'>최근 본 상품이 없습니다</span>
            ) : (
              <div>
                <span className='text-sm text-red-500 font-bold'>{recentProducts.length}</span>
                <div className='flex flex-col gap-2 border-t border-black border-dashed pt-3 pb-2 mt-2'>
                  {recentProducts.slice(currentPage * 3, (currentPage + 1) * 3).map(({ id, title, price, imageUrls }) => (
                    <RecentItemDetail 
                      key={id} 
                      id={id} 
                      title={title} 
                      price={price} 
                      imageUrl={imageUrls[0]} 
                    />
                  ))}
                </div>
                <div className='w-full flex items-center justify-between mt-2'>
                  <button
                    disabled={currentPage === 0} 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className='border border-gray-300 h-4 w-4 flex justify-center items-center'
                  >
                    <ChevronLeftIcon className='h-4 w-4 text-gray-500' />
                  </button>
                  <span className='text-xs text-gray-500'>{currentPage + 1} / {totalPage + 1}</span>
                  <button 
                    disabled={currentPage === totalPage} 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className='border border-gray-300 h-4 w-4 flex justify-center items-center'
                  >
                    <ChevronRightIcon className='h-4 w-4 text-gray-500' />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentItem;

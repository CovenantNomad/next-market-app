import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getProductByKeyword } from '@/repository/products/getProductByKeyword';
import { ChevronRightIcon, StoreIcon } from 'lucide-react';
import { throttle } from 'lodash';
import { addRecentKeyword } from '@/lib/localStorage';
import supabase from '@/lib/supabase/browserClient';

type RecommendSearchProps = {
  query: string
  onCloseHandler: () => void
}

const RecommendSearch = ({ query, onCloseHandler }: RecommendSearchProps) => {
  const [ keywords, setKeywords ] = useState<string[]>([])

  const onSearchHandler = useMemo(() => throttle(async (query: string) => {
    if (!query) {
      setKeywords([])
      return 
    }

    const { data } = await getProductByKeyword(supabase, { 
      query,
      fromPage: 0,
      toPage: 2
    })
    setKeywords(data.map(({ title }) => title))
  }, 500), [])

  useEffect(() => {
    onSearchHandler(query)

  }, [query])

  return (
    <div className='h-full flex flex-col'>
      <div className='h-full flex-1 p-2'>
        <Link href={`/search/shop?query=${encodeURIComponent(query)}`}>
          <div
            onClick={onCloseHandler} 
            className='w-full flex items-center gap-x-2 border-b border-b-red-500 pb-2 cursor-pointer'
          >
            <StoreIcon className='h-4 w-4 shrink-0'/>
            <span className='text-sm font-bold shrink-0'>상점 검색</span>
            <ChevronRightIcon className='h-4 w-4 shrink-0'/>
            <span className='text-sm font-bold text-red-500 truncate'>
              {query}
            </span>
            <span className='text-sm text-gray-500 shrink-0'>상점명으로 검색</span>
          </div>
        </Link>
        <div className='h-full py-3'>
          {keywords.length === 0 ? (
            <div className='h-full flex items-center justify-center'>
              <span className='text-sm text-gray-600'>검색결과가 없습니다</span>
            </div>
          ) : (
            <div className='h-full overflow-scroll pb-8'>
              {keywords.map((keyword, index) => (
                <Link href={`/search?query=${encodeURIComponent(keyword)}`}>
                  <span 
                    key={index} 
                    className='block text-sm hover:bg-gray-100 py-3 truncate cursor-pointer'
                    onClick={() => {
                      addRecentKeyword(keyword)
                      onCloseHandler()
                    }}
                  >
                    {keyword}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className='flex justify-end items-center bg-gray-100 p-2'>
        <span className='text-sm text-gray-600 cursor-pointer' onClick={onCloseHandler}>닫기</span>
      </div>
    </div>
  );
};

export default RecommendSearch;


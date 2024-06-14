import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { RECENT_KEYWORDS_KEY, addRecentKeyword, clearRecentKeyword, getRecentKeywords } from '@/lib/localStorage';

type RecentSearchProps = {
  onCloseHandler: () => void
}

const RecentSearch = ({ onCloseHandler }: RecentSearchProps) => {
  const [ recents, setRecents ] = useState<string[]>([])

  const handleSetRecents = useCallback(() => {
    const recents = getRecentKeywords()
    setRecents(recents)
  }, [])

  useEffect(() => {
    handleSetRecents()
  }, [handleSetRecents])

  useEffect(() => {
    const eventHandler = () => handleSetRecents()
    window.addEventListener(RECENT_KEYWORDS_KEY, eventHandler)

    return () => window.removeEventListener(RECENT_KEYWORDS_KEY, eventHandler)
  }, [handleSetRecents])

  return (
    <div className='h-full flex flex-col'>
      <div className='h-full flex-1 p-2'>
        <div className='border-b border-b-red-500 pb-1'>
          <span className='text-sm font-bold text-red-500'>최근검색어</span>
        </div>
        <div className='h-full py-3'>
          {recents.length === 0 ? (
            <div className='h-full flex items-center justify-center'>
              <span className='text-sm text-gray-600'>최근 검색어가 없습니다</span>
            </div>
          ) : (
            <div className='flex flex-col'>
              {recents.map((keyword, index) => (
                <Link key={index} href={`/search?query=${encodeURIComponent(keyword)}`}>
                  <span 
                    className='block text-sm hover:bg-gray-100 py-2 truncate cursor-pointer'
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
      <div className='flex justify-between items-center bg-gray-100 p-2'>
        <span className='text-sm text-gray-600 cursor-pointer' onClick={clearRecentKeyword}>검색어 전체 삭제</span>
        <span className='text-sm text-gray-600 cursor-pointer' onClick={onCloseHandler}>닫기</span>
      </div>
    </div>
  );
};

export default RecentSearch;

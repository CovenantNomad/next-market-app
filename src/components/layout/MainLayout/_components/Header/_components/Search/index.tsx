import { useEffect, useRef, useState } from 'react';
import { addRecentKeyword } from '@/lib/localStorage';
import { SearchIcon } from 'lucide-react';
import RecentSearch from './_components/RecentSearch';
import RecommendSearch from './_components/RecommendSearch';
import { useRouter } from 'next/router';


type SearchProps = {}

const Search = ({}: SearchProps) => {
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [ search, setSearch ] = useState('')
  const [ isFocused, setIsFocused ] = useState<boolean>(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const isClickedInSearchArea = !!searchRef.current?.contains(e.target as Node)
      setIsFocused(isClickedInSearchArea)
    }
    window.addEventListener('click', handler)

    return () => window.removeEventListener('click', handler)
  }, [])

  return (
    <div ref={searchRef} className='relative flex-1 ml-8'>
      <div className='w-96 border border-red-500 px-4 py-2'>
        <form 
          className='flex justify-between items-center' 
          onSubmit={(e) => {
            e.preventDefault()
            //최근 검색어 추가
            addRecentKeyword(search)
            router.push(`/search?query=${encodeURIComponent(search)}`)
          }}
        >
          <input 
            className='w-full text-sm font-light outline-0'
            type='text'
            placeholder='상품명, 상점명 입력'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onClick={() => setIsFocused(true)}
          />
          <button>
            <SearchIcon className='h-4 w-4'/>
          </button>
        </form>
      </div>
      {isFocused && (
        <div className={'block absolute w-full h-96 border border-gray-300 bg-white mt-2'}>
          {
            !search ? 
              <RecentSearch onCloseHandler={() => setIsFocused(false)} /> 
            : <RecommendSearch query={search} onCloseHandler={() => setIsFocused(false)} />
          }
        </div>
      )}
    </div>
  );
};

export default Search;

import { useEffect, useState } from 'react';
import { TLike } from '@/types';
import { getShopLikes } from '@/repository/shops/getShopLikes';
import Link from 'next/link';
import CustomPagination from '@/components/common/CustomPagination/CustomPagination';
import LikeItem from '../LikeItem';
import supabase from '@/lib/supabase/browserClient';


type LikeTabProps = {
  shopId?: string
  initialLikes?: TLike[]
  LikeCount?: number
}

const LikeTab = ({
  shopId,
  initialLikes = [],
  LikeCount = 0,
}: LikeTabProps) => {
  //화면에 보이는 Page는 1부터 시작, API는 0부터 시작
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ likes, setLikes ] = useState<TLike[]>(initialLikes)

  useEffect(() => {
    if (!shopId) {
      return 
    }
    (async () => {
      // 페이지 바뀔때마다 데이터 받아오기
      const { data } = await getShopLikes(supabase, {
        shopId,
        // API 요청시에는 0부터 시작
        fromPage: currentPage - 1,
        toPage: currentPage
      })

      setLikes(data)
    })()

  }, [currentPage, shopId])

  return (
    <div>
      <div className='pt-10 pb-6'>
        <span>찜</span>
        <span className='inline-block ml-2 text-red-500'>{LikeCount.toLocaleString()}개</span>
      </div>
      <div>
        {likes.length === 0 ? (
          <div>
            <span className='text-gray-500'>등록된 찜이 없습니다</span>
          </div>
        ) : (
          <div>
            <div className='w-full grid grid-cols-5 gap-4'>
              {likes.map(({ id, productId, createdAt, createdBy }) => (
                <Link key={id} href={`/products/${id}`}>
                  <LikeItem 
                    productId={productId}
                  />
                </Link>
              ))}
            </div>
            <div className='flex justify-center mt-8'>
              <CustomPagination 
                currentPage={currentPage}
                total={LikeCount}
                onPageChangeHandler={(pageNumber) => setCurrentPage(pageNumber)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikeTab;

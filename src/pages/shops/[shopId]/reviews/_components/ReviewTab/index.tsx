import { useEffect, useState } from 'react';

import { getShopReviews } from '@/repository/shops/getShopReviews';

import { TReview } from '@/types';

import ReviewItem from '../ReviewItem';
import CustomPagination from '@/components/common/CustomPagination/CustomPagination';
import supabase from '@/lib/supabase/browserClient';


type ReviewTabProps = {
  shopId?: string
  initialReviews?: TReview[]
  reviewCount?: number
}

const ReviewTab = ({ shopId, initialReviews = [], reviewCount = 0 }: ReviewTabProps) => {
  //화면에 보이는 Page는 1부터 시작, API는 0부터 시작
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ reviews, setReviews ] = useState<TReview[]>(initialReviews)

  useEffect(() => {
    if (!shopId) {
      return 
    }

    (async () => {
      // 페이지 바뀔때마다 데이터 받아오기
      const { data } = await getShopReviews(supabase, {
        shopId,
        // API 요청시에는 0부터 시작
        fromPage: currentPage - 1,
        toPage: currentPage
      })

      setReviews(data)
    })()

  }, [currentPage, shopId])

  return (
    <div>
      <div className='pt-10 pb-6'>
        <span>후기</span>
        <span className='inline-block ml-2 text-red-500'>{reviewCount.toLocaleString()}개</span>
      </div>
      <div>
        {reviews.length === 0 ? (
          <div>
            <span className='text-gray-500'>등록된 후기가 없습니다</span>
          </div>
        ) : (
          <div>
            <div className='w-full flex flex-col gap-y-4'>
              {reviews.map(({ id, contents, productId, createdBy, createdAt }) => (
                <ReviewItem 
                  key={id}
                  productId={productId}
                  reviewerId={createdBy}
                  contents={contents}
                  createdAt={createdAt}
                />
              ))}
            </div>
            <div className='flex justify-center mt-8'>
              <CustomPagination 
                currentPage={currentPage}
                total={reviewCount}
                onPageChangeHandler={(pageNumber) => setCurrentPage(pageNumber)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewTab;

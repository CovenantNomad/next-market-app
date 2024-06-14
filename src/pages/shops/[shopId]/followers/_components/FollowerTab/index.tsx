import { useEffect, useState } from 'react';
import { TFollow } from '@/types';
import { getShopFollowings } from '@/repository/shops/getShopFollowing';

import CustomPagination from '@/components/common/CustomPagination/CustomPagination';
import FollowerItem from '../FollowerItem';
import { getShopFollowers } from '@/repository/shops/getShopFollowers';
import supabase from '@/lib/supabase/browserClient';

type FollowingTabProps = {
  shopId?: string
  initialFollower?: TFollow[]
  followerCount?: number
}

const FollowerTab = ({
  shopId,
  initialFollower = [],
  followerCount = 0
}: FollowingTabProps) => {
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ followers, setFollowers ] = useState<TFollow[]>(initialFollower)

  useEffect(() => {
    if (!shopId) {
      return 
    }
    (async () => {
      // 페이지 바뀔때마다 데이터 받아오기
      const { data } = await getShopFollowers(supabase, {
        shopId,
        // API 요청시에는 0부터 시작
        fromPage: currentPage - 1,
        toPage: currentPage
      })

      setFollowers(data)
    })()

  }, [currentPage, shopId])

  return (
    <div>
      <div className='pt-10 pb-6'>
        <span>팔로워</span>
        <span className='inline-block ml-2 text-red-500'>{followerCount.toLocaleString()}개</span>
      </div>
      <div>
        {followers.length === 0 ? (
          <div>
            <span className='text-gray-500'>팔로워하는 상점이 없습니다</span>
          </div>
        ) : (
          <div>
            <div className='w-full flex flex-col gap-y-4'>
              {followers.map(({ id, createdBy }) => (
                <FollowerItem 
                  key={id}
                  shopId={createdBy}
                />
              ))}
            </div>
            <div className='flex justify-center mt-8'>
              <CustomPagination 
                currentPage={currentPage}
                total={followerCount}
                onPageChangeHandler={(pageNumber) => setCurrentPage(pageNumber)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowerTab;

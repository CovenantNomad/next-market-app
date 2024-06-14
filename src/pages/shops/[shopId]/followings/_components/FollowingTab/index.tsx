import { useEffect, useState } from 'react';
import { TFollow } from '@/types';
import { getShopFollowings } from '@/repository/shops/getShopFollowing';
import FollowingItem from '../FollowingItem';
import CustomPagination from '@/components/common/CustomPagination/CustomPagination';
import supabase from '@/lib/supabase/browserClient';

type FollowingTabProps = {
  shopId?: string
  initialFollowing?: TFollow[]
  followingCount?: number
}

const FollowingTab = ({
  shopId,
  initialFollowing = [],
  followingCount = 0
}: FollowingTabProps) => {
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ followings, setFollowings ] = useState<TFollow[]>(initialFollowing)

  useEffect(() => {
    if (!shopId) {
      return 
    }
    (async () => {
      // 페이지 바뀔때마다 데이터 받아오기
      const { data } = await getShopFollowings(supabase, {
        shopId,
        // API 요청시에는 0부터 시작
        fromPage: currentPage - 1,
        toPage: currentPage
      })

      setFollowings(data)
    })()

  }, [currentPage, shopId])

  return (
    <div>
      <div className='pt-10 pb-6'>
        <span>팔로잉</span>
        <span className='inline-block ml-2 text-red-500'>{followingCount.toLocaleString()}개</span>
      </div>
      <div>
        {followings.length === 0 ? (
          <div>
            <span className='text-gray-500'>팔로잉하는 상점이 없습니다</span>
          </div>
        ) : (
          <div>
            <div className='w-full flex flex-col gap-y-4'>
              {followings.map(({ id, followingShopId }) => (
                <FollowingItem 
                  key={id}
                  shopId={followingShopId}
                />
              ))}
            </div>
            <div className='flex justify-center mt-8'>
              <CustomPagination 
                currentPage={currentPage}
                total={followingCount}
                onPageChangeHandler={(pageNumber) => setCurrentPage(pageNumber)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingTab;

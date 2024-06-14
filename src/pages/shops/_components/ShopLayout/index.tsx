import { FormEvent, ReactNode, useState } from 'react';
import Link from 'next/link';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

import { cn } from '@/lib/utils';

import { TShop } from '@/types';

import ShopProfileImage from '@/components/shops/ShopProfileImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { timeOut } from '@/lib/mock';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/layout/Container/Container';
import { updateShopName } from '@/repository/shops/updateShopName';
import supabase from '@/lib/supabase/browserClient';
import { Textarea } from '@/components/ui/textarea';
import { updateShopIntroduce } from '@/repository/shops/updateShopIntroduce';
import { updateShopImage } from '@/repository/shops/updateShopImageUrl';

dayjs.extend(relativeTime).locale('ko')

type Tabs = 'products' | 'reviews' | 'likes' | 'followings' | 'followers'

type ShopLayoutProps = {
  shop?: TShop
  productCount: number
  reviewCount: number
  followerCount: number
  followingCount: number
  likeCount: number
  currentTab: Tabs
  isMyShop?: boolean
  children: ReactNode
}

type EDIT_STATUS = 'IDLE' | 'EDIT' | 'LOADING'

const ShopLayout = ({
  shop,
  productCount,
  reviewCount,
  followerCount,
  followingCount,
  likeCount,
  currentTab,
  isMyShop,
  children
}: ShopLayoutProps) => {
  const [ shopName, setShopName ] = useState(shop?.name || '')
  const [ shopIntroduce, setShopIntroduce ] = useState(shop?.introduce || '')
  const [ shopImageUrl, setShopImageUrl ] = useState(shop?.imageUrl || '')
  const [ shopNameStatus, setShopNameStatus ] = useState<EDIT_STATUS>('IDLE')
  const [ shopIntroduceStatus, setShopIntroduceStatus ] = useState<EDIT_STATUS>('IDLE')

  const onSubmitNameHandler = async (e: FormEvent<HTMLFormElement>) => {
    if (!shop) {
      return 
    }
    try {
      e.preventDefault()
      setShopNameStatus('LOADING')
      
      const formData = new FormData(e.currentTarget)
      const name = formData.get('name') as string

      await updateShopName(supabase, { shopId: shop.id, name })
      setShopName(name)

      alert('상점명을 수정했습니다')

    } catch (error) {
      alert('상점명 수정에 실패했습니다')

    } finally {
      setShopNameStatus('IDLE')
    }
  }

  const onSubmitIntroduceHandler = async (e: FormEvent<HTMLFormElement>) => {
    if (!shop) {
      return 
    }
    try {
      e.preventDefault()
      setShopIntroduceStatus('LOADING')

      const formData = new FormData(e.currentTarget)
      const introduce = formData.get('introduce') as string

      await updateShopIntroduce(supabase, { shopId: shop.id, introduce })
      setShopIntroduce(introduce)

      alert('소개글을 수정했습니다')

    } catch (error) {
      alert('소개글 수정에 실패했습니다')

    } finally {
      setShopIntroduceStatus('IDLE')
      
    }
  }

  const onSubmitImageHandler = async (e: FormEvent<HTMLFormElement>) => {
    if (!shop) {
      return 
    }

    try {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const imageFile = formData.get('shopProfile') as File

      const { data: { imageUrl }} = await updateShopImage(supabase, { shopId: shop.id, imageFile })
      setShopImageUrl(imageUrl)

      alert('프로필사진을 업데이트 했습니다')

    } catch (error) {
      alert('프로필사진 업데이트를 실패했습니다')

    }
  }

  if (!shop) {
    return 
  }

  return (
    <MainLayout>
      <Container>
        <div className='py-10'>
          <div className='h-64 w-full flex border border-gray-300'>
            <div className='w-64 h-full flex flex-col justify-center items-center gap-y-3 bg-gray-300'>
              {!isMyShop ? (
                <ShopProfileImage imageUrl={shopImageUrl || undefined} />
              ) : (
                <>
                  <form onChange={onSubmitImageHandler}>
                    <label htmlFor='shopProfile' className='cursor-pointer'>
                      <ShopProfileImage imageUrl={shopImageUrl || undefined} />
                    </label>
                    <input type="file" id="shopProfile" name="shopProfile" hidden accept='image/webp, image/png, image/jpg, image/jpeg' />
                  </form>
                  <Link href={'/products'} className='border border-white px-2 py-1'>
                    <span className='text-white text-sm'>내 상점 관리</span>
                  </Link>
                </>
              )}
            </div>
            <div className='w-full h-full flex flex-col'>
              <div className='py-4 px-4'>
                {isMyShop ? (
                  shopNameStatus === 'IDLE' ? (
                    <div className='flex items-center gap-x-4'>
                      <span className='text-lg'>{shopName}</span>
                      <Button size={'sm'} variant={'outline'} onClick={() => setShopNameStatus('EDIT')}>상점명 수정</Button>
                    </div>
                  ) : (
                    <form onSubmit={onSubmitNameHandler}>
                      <div className='flex items-center gap-x-4'>
                        <Input
                          name='name'
                          required
                          minLength={2} 
                          disabled={shopNameStatus === 'LOADING'}
                          placeholder='새 상점명을 입력하세요 (2글자 이상)'
                          className='w-60 text-xs'
                        />
                        <Button
                          type='submit' 
                          size={'sm'}
                          disabled={shopNameStatus === 'LOADING'}
                          className='text-sm'
                        >
                          {shopNameStatus === 'LOADING' ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>수정 중..</span>
                            </>
                          ) : (
                            <span>확인</span>
                          )} 
                        </Button>
                      </div>
                    </form>
                  )
                ) : (
                  <span className='text-lg'>{shopName}</span>
                )}
              </div>
              <div className='flex gap-x-3 py-4 px-4 border-y'>
                <span className='text-gray-500'>가입일</span>
                <span className='font-bold'>{dayjs(shop?.createdAt).fromNow()}</span>
                <span className='text-gray-500'>상품수</span>
                <span className='font-bold'>{productCount.toLocaleString()}개</span>
              </div>
              <div className='flex-1 flex flex-col py-4 px-4 overflow-hidden'>
                {isMyShop ? (
                  shopIntroduceStatus === 'IDLE' ? (
                    <>
                      <p className='h-full text-sm overflow-scroll'>
                        {shopIntroduce}
                      </p>
                      <Button 
                        size={'sm'} 
                        variant={'outline'} 
                        onClick={() => setShopIntroduceStatus('EDIT')}
                        className='w-20 shrink-0'
                      >
                          소개글 수정
                      </Button>
                    </>
                  ) : (
                    <form 
                      onSubmit={onSubmitIntroduceHandler}
                      className='relative flex h-full flex-1'
                    >
                      <Textarea
                        name='introduce'
                        required
                        disabled={shopIntroduceStatus === 'LOADING'}
                        placeholder='소개글을 입력해주세요'
                        className='disabled:opacity-50'
                      >
                        {shopIntroduce}
                      </Textarea>
                      <Button 
                        type='submit'
                        size={'sm'}
                        disabled={shopIntroduceStatus === 'LOADING'}
                        className='absolute bottom-2 right-2 w-20 text-sm'
                      >
                        {shopIntroduceStatus === 'LOADING' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>제출 중..</span>
                          </>
                        ) : (
                          <span>확인</span>
                        )} 
                      </Button>
                    </form>
                  )
                ) : (
                  <p className='h-full text-sm overflow-scroll'>{shopIntroduce}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-5 mt-10'>
          <Link href={`/shops/${shop.id}/products`}>
            <div className={cn(
              'flex justify-center items-center gap-x-2 py-2 border',
              currentTab === 'products' 
                ? 'border-b-0 border-black' 
                : 'bg-gray-100 text-gray-600 border-gray-300 '
              )}
            >
              <span>상품</span>
              <span>{productCount.toLocaleString()}</span>
            </div>
          </Link>
          <Link href={`/shops/${shop.id}/reviews`}>
            <div className={cn(
              'flex justify-center items-center gap-x-2 py-2 border',
              currentTab === 'reviews' 
                ? 'border-b-0 border-black' 
                : 'bg-gray-100 text-gray-600 border-gray-300 '
              )}
            >
              <span>상점후기</span>
              <span>{reviewCount.toLocaleString()}</span>
            </div>
          </Link>
          <Link href={`/shops/${shop.id}/likes`}>
            <div className={cn(
              'flex justify-center items-center gap-x-2 py-2 border',
              currentTab === 'likes' 
                ? 'border-b-0 border-black' 
                : 'bg-gray-100 text-gray-600 border-gray-300 '
              )}
            >
              <span>찜</span>
              <span>{likeCount.toLocaleString()}</span>
            </div>
          </Link>
          <Link href={`/shops/${shop.id}/followings`}>
            <div className={cn(
              'flex justify-center items-center gap-x-2 py-2 border',
              currentTab === 'followings' 
                ? 'border-b-0 border-black' 
                : 'bg-gray-100 text-gray-600 border-gray-300 '
              )}
            >
              <span>팔로잉</span>
              <span>{followingCount.toLocaleString()}</span>
            </div>
          </Link>
          <Link href={`/shops/${shop.id}/followers`}>
            <div className={cn(
              'flex justify-center items-center gap-x-2 py-2 border',
              currentTab === 'followers' 
                ? 'border-b-0 border-black' 
                : 'bg-gray-100 text-gray-600 border-gray-300 '
              )}
            >
              <span>팔로워</span>
              <span>{followerCount.toLocaleString()}</span>
            </div>
          </Link>
        </div>
        <div className='pb-12'>{children}</div>
      </Container>
    </MainLayout>
  );
};

export default ShopLayout;

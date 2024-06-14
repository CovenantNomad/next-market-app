import Container from '@/components/layout/Container/Container';
import MainLayout from '@/components/layout/MainLayout';
import { getProduct } from '@/repository/products/getProduct';
import { TProduct, TReview, TShop } from '@/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ChevronRightIcon, Clock5Icon, UserRoundPlusIcon, UserRoundXIcon } from 'lucide-react';
import ProductThumbnail from './_components/ProductThumbnail';
import { Button } from '@/components/ui/button';
import { getMe } from '@/repository/me/getMe';
import { getIsLikedWithProductIdAndShopId } from '@/repository/likes/getIsLikedWithProductIdAndShopId';
import { useEffect, useState } from 'react';
import { getProductsByTag } from '@/repository/products/getProductsByTag';
import ProductCard from '@/components/products/ProductCard/ProductCard';
import Link from 'next/link';
import { getShop } from '@/repository/shops/getShop';
import ShopCard from '@/components/shops/ShopCard';
import { getShopInfomation } from '@/repository/shops/getShopInfomation';
import { getIsFollowedByShopId } from '@/repository/follows/getIsFollowedByShopId';
import { getShopProducts } from '@/repository/shops/getShopProducts';
import { getShopReviews } from '@/repository/shops/getShopReviews';
import ShopReviewItem from './_components/ShopReviewItem';
import { addRecentItems } from '@/lib/localStorage';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import getServerSupabase from '@/lib/supabase/serverClient';
import { createLike } from '@/repository/likes/createLike';
import supabase from '@/lib/supabase/browserClient';
import { deleteLike } from '@/repository/likes/deleteLike';
import { createFollow } from '@/repository/follows/createFollow';
import { deleteFollow } from '@/repository/follows/deleteFollow';
import { buyProduct } from '@/repository/products/buyProduct';
import { createChatRoom } from '@/repository/chatRooms/createChatRoom';


dayjs.extend(relativeTime).locale('ko')

const MarkdownViewer = dynamic(
  () => import('@/components/shared/MarkdownViewer'),
  {
    ssr: false,
    loading: () => (
      <div className='flex flex-col space-y-2'>
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    )
  }
)


const ProductDetailPage = ({ 
  product,
  shop,
  myShopId,
  isLiked: initialIsLiked,
  suggestedProducts,
  productCount,
  followerCount,
  reviewCount,
  isFollowed: initialFollowed,
  shopProducts,
  shopReviews
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const [ isFollowed, setIsFollowed ] = useState(initialFollowed)
  const [ isLiked, setIsLiked ] = useState<boolean>(initialIsLiked)

  const checkAuth = (func: Function) => {
    if (!myShopId) {
      alert('로그인이 필요합니다')
      return
    }

    func()
  }

  const onToggleLikeHandler = () => checkAuth(async () => {
    try {
      setIsLiked(!isLiked)

      if (!isLiked) {
        await createLike(supabase, product.id)
      } else {
        await deleteLike(supabase, product.id)
      }
    } catch (error) {
      setIsLiked(isLiked)
    }

  })

  const onToggleFollowHandler = () => checkAuth(async () => {
    try {
      setIsFollowed(!isFollowed)
      if (!isFollowed) {
        await createFollow(supabase, product.createdBy)
      } else {
        await deleteFollow(supabase, product.createdBy)
      }

    } catch (error) {
      setIsFollowed(isFollowed)
    }

  })

  const onChatHandler = () => checkAuth(async () => {
    const { data: chatRoom } = await createChatRoom(supabase, product.createdBy)
    router.push(`/messages/${chatRoom.id}`)
  })

  const onPurchaseHandler = () => checkAuth(async () => {
    await buyProduct(supabase, product.id)
    window.location.reload()
  })

  useEffect(() => {
    addRecentItems(product.id)
    
  }, [product.id])

  return (
    <MainLayout>
      <Container>
        <div className='flex gap-x-6 py-8 border-b-2 border-black'>
          <div>
            <div className='w-96 h-96 bg-gray-300 shrink-0'>
              <ProductThumbnail imageUrls={product.imageUrls} />
            </div>
          </div>
          <div className='w-full flex flex-col justify-between flex-1 min-w-0'>
            <div>
              <div>
                <span className='text-4xl font-bold truncate'>
                  {product.title}
                </span>
              </div>
              <div className='py-6'>
                <span className='text-3xl'>{product.price.toLocaleString()}</span>
                <span className='text-xl'>원</span>
              </div>
              <div className='flex items-center gap-x-2 border-t border-t-gray-500 py-4'>
                <Clock5Icon className='h-5 w-5 text-gray-500' />
                <span className='text-gray-500'>{dayjs(product.createdAt).fromNow()}</span>
              </div>
            </div>
            <div className='w-full flex justify-between gap-x-4'>
              <Button 
                size={'lg'} 
                onClick={onToggleLikeHandler}
                className='w-full bg-gray-500'
              >
                {isLiked ? '찜 취소' : '찜 하기'}
              </Button>
              <Button 
                size={'lg'} 
                onClick={onChatHandler}
                className='w-full bg-orange-500'
              >
                문의하기
              </Button>
              <Button 
                size={'lg'}
                disabled={!!product.purchaseBy} 
                onClick={onPurchaseHandler}
                className='w-full bg-red-500'
              >
                {!!product.purchaseBy ? '판매완료' : '바로구매'}
              </Button>
            </div>
          </div>
        </div>
        <div className='flex mt-8'>
          <div className='w-2/3 pt-2 pr-4'>
            <span className='text-xl font-bold'>상품정보</span>
            <div className='py-6 mt-4 border-y border-y-gray-300'>
              <MarkdownViewer value={product.description} />
            </div>
            <div className='flex gap-x-4 py-6 border-b border-b-gray-300'>
              <span className='text-sm font-bold rounded-md bg-gray-200 px-2 py-1'>{product.isUsed ? '중고상품' : '새상품'}</span>
              <span className='text-sm font-bold rounded-md bg-gray-200 px-2 py-1'>{product.isUsed ? '교환가능' : '교환불가'}</span>
            </div>
            <div className='flex py-6'>
              <div className='flex-1 flex flex-col items-center gap-y-4'>
                <span className='text-lg text-gray-500'>거래지역</span>
                <span className='text-gray-500'>{product.address}</span>
              </div>
              <div className='flex-1 flex flex-col items-center gap-y-4'>
                <span className='text-lg text-gray-500'>상품태그</span>
                <div>{product.tags === null ? (
                  <span className='text-sm text-gray-500'>상품 태그가 없습니다</span>
                ) : (
                  <div className='flex justify-center gap-2 flex-wrap'>
                    {product.tags.map(tag => <span className='text-sm px-2 rounded-xl bg-purple-200'>{tag}</span>)}
                  </div>
                )}</div>
              </div>
            </div>
            {
              suggestedProducts.length === 0 ? null : (
                <div className='py-6 mt-4'>
                  <div>
                    <span className='text-xl font-bold'>비슷한 상품</span>
                  </div>
                  <div className='grid grid-cols-3 gap-x-6 mt-6'>
                    {suggestedProducts.slice(0, 3).map(product => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                      >
                        <ProductCard 
                          title={product.title}
                          price={product.price}
                          createdAt={product.createdAt}
                          imageUrl={product.imageUrls[0]}
                          isSoldOut={product.purchaseBy ? true : false}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </div>
          <div className='w-1/3 border-l border-l-gray-300 pl-4 pt-2'>
            <span className='text-xl font-bold'>상점정보</span>
            <div className='py-6'>
              <ShopCard 
                name={shop.name}
                profileImageUrl={shop.imageUrl || undefined}
                productCount={productCount}
                followerCount={followerCount}
                onClickTitleHandler={() => router.push(`/shops/${shop.id}`)}
                onClickProfileImageHandler={() => router.push(`/shops/${shop.id}`)}
                onClickProductCountHandler={() => router.push(`/shops/${shop.id}/products`)}
                onClickFollowCountHandler={() => router.push(`/shops/${shop.id}/followers`)}
              />
            </div>
            <div className='px-4'>
              <Button 
                onClick={onToggleFollowHandler}
                className='w-full flex items-center leading-none gap-x-1'
              >
                {isFollowed ? (
                  <UserRoundXIcon  className='h-4 w-4' />
                ) : (
                  <UserRoundPlusIcon className='h-4 w-4' />
                )}
                <span>{isFollowed ? '언팔로우' : '팔로우'}</span>
              </Button>
            </div>
            <div className='mt-8 px-4'>
              <div className='grid grid-cols-2 gap-x-2'>
                {shopProducts.slice(0, 2).map(({ id, imageUrls, price }) => (
                  <Link href={`/products/${id}`} key={id}>
                    <div className='relative aspect-square'>
                      <img src={imageUrls[0]} alt='상품이미지' className='w-full h-full'/>
                      <div className='absolute bottom-0 w-full bg-gray-800/50 text-center py-1'>
                        <span className='text-sm text-white'>{price.toLocaleString()} 원</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {
                productCount > 2 && (
                  <Link href={''}>
                    <div className='w-full mt-1 py-3 text-center border-y border-gray-300'>
                      <span className='text-sm text-red-500'>{productCount - 2}개</span>{' '}
                      <span className='text-sm text-gray-500'>상품 더 보기</span>
                      <ChevronRightIcon className='inline-block w-4 h-4 text-gray-500'/>
                    </div>
                  </Link>
                )
              }
            </div>
            <div className='px-4'>
              <div className='py-4'>
                <span className='text-lg font-bold'>상점후기</span>{' '}
                <span className='text-lg font-bold text-red-500'>{reviewCount.toLocaleString()}</span>
              </div>
              <div className='flex flex-col gap-y-6 mt-3'>
                {shopReviews.slice(0,3).map(({ id, contents, createdBy, createdAt }) => (
                  <ShopReviewItem 
                    key={id}
                    contents={contents} 
                    createdBy={createdBy} 
                    createdAt={createdAt}
                  />
                ))}
              </div>
              {
                reviewCount > 3 && (
                  <Link href={`/shops/${shop.id}/reviews`}>
                    <div className='w-full mt-4 py-3 text-center border-y border-gray-300'>
                      <span className='text-sm text-gray-500'>상점후기 더 보기</span>
                      <ChevronRightIcon className='inline-block w-4 h-4 text-gray-500'/>
                    </div>
                  </Link>
                )
              }
              <div className='w-full flex justify-between gap-x-4 mt-8'>
                <Button 
                  size={'lg'} 
                  onClick={onChatHandler}
                  className='w-full bg-orange-500'
                >
                  문의하기
                </Button>
                <Button 
                  size={'lg'}
                  disabled={!!product.purchaseBy} 
                  onClick={onPurchaseHandler}
                  className='w-full bg-red-500'
                >
                  {!!product.purchaseBy ? '판매완료' : '바로구매'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default ProductDetailPage;

export const getServerSideProps: GetServerSideProps<{ 
  product: TProduct
  shop: TShop 
  myShopId: string | null 
  isLiked: boolean
  suggestedProducts: TProduct[]
  followerCount: number 
  productCount: number
  reviewCount: number
  isFollowed: boolean
  shopProducts: TProduct[]
  shopReviews: TReview[]
}> = async (context) => {
  const supabase = getServerSupabase(context)
  const productId = context.query.productId as string

  const { data: product } = await getProduct(supabase, productId)

  const { data: { shopId: myShopId } } = await getMe(supabase)

  const [
    { data: isLiked },
    productByTags,
    { data: shop },
    { data: { productCount, followerCount, reviewCount }},
    { data: isFollowed },
    { data: shopProducts },
    { data: shopReviews }
  ] = await Promise.all([
    myShopId === null ? { data : false } : await getIsLikedWithProductIdAndShopId(supabase,{
      productId: productId,
      shopId: myShopId
    }),
    Promise.all((product.tags || []).map(tag => getProductsByTag(supabase, tag))),
    getShop(supabase, product.createdBy),
    getShopInfomation(supabase, product.createdBy),
    myShopId !== null 
      ? getIsFollowedByShopId(supabase, { 
          followerId: myShopId, 
          followedId: product.createdBy 
        }) 
      : { data: false },
    getShopProducts(supabase, { shopId: product.createdBy, fromPage: 0, toPage: 1 }),
    getShopReviews(supabase, { shopId: product.createdBy, fromPage: 0, toPage: 1})
  ])

  const suggestedProducts = productByTags.map(({ data }) => data).flat()

  return { 
    props: { 
      product, 
      shop, 
      myShopId, 
      isLiked, 
      suggestedProducts, 
      productCount, 
      followerCount, 
      reviewCount, 
      isFollowed, 
      shopProducts, 
      shopReviews 
    }
  }
}
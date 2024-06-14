import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { TProduct, TReview } from '@/types';
import { getProduct } from '@/repository/products/getProduct';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/layout/Container/Container';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { getReviewByProductId } from '@/repository/reviews/getReviewByProductId';
import dynamic from 'next/dynamic';
import MarkdownSkeleton from '@/components/shared/MarkdownSkeleton/MarkdownSkeleton';
import { getMe } from '@/repository/me/getMe';
import { AuthError } from '@/lib/error';
import getServerSupabase from '@/lib/supabase/serverClient';
import { createReview } from '@/repository/reviews/createReview';
import supabase from '@/lib/supabase/browserClient';

const MarkdownEditor = dynamic(
  () => import('@/components/shared/MarkdownEditor'),
  {
    ssr: false,
    loading: () => <MarkdownSkeleton />
  }
)

const ProductReviewPage = ({ product, review }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [ isLoading, setIsLoading ] = useState(false)
  const [ value, setValue ] = useState<string>(review?.contents || '')
  
  const onSubmitHandler = async () => {
    try {
      setIsLoading(true)
      await createReview(supabase, { 
        productId: product.id,
        contents: value
      })

      window.location.reload()
    } catch (error) {
      alert('후기 작성을 실패했습니다')

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <Container>
        <div className='pb-12'>
          <div className='py-10'>
            <span className='text-2xl text-red-500'>{product.title}</span>
            <span className='text-xl font-light'>의 구매 후기를 작성해주세요</span>
          </div>
          <div>
            <MarkdownEditor
              disabled={!!review}
              initialValue={value} 
              onChangeHandler={(value) => setValue(value)}
            />
            <div className='flex justify-end mt-2'>
              <Button 
                disabled={!!review || isLoading}
                onClick={onSubmitHandler}
              >
                {isLoading ? '제출중..' : '작성하기'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default ProductReviewPage;


export const getServerSideProps: GetServerSideProps<{
  product: TProduct
  review: TReview | null
}> = async (context) => {
  try {
    const supabase = getServerSupabase(context)
    const { data: { shopId }} = await getMe(supabase)

    if (shopId === null) {
      throw new AuthError('로그인이 필요합니다')
    }

    const productId = context.query.productId as string

    const [
      { data: product },
      { data: review }
    ] = await Promise.all([
      getProduct(supabase, productId),
      getReviewByProductId(supabase, productId)
    ])
  
    return {
      props: {
        product,
        review
      }
    }

  } catch (e) {
    if (e instanceof AuthError) {
      return {
        redirect: {
          destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false
        }
      }
    }
    throw e
      
  }
  
}
import { ReactNode } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/layout/Container/Container';
import Link from 'next/link';

type TCurrentTabs = 'register' | 'manage' | 'history'

type ProductsLayoutProps = {
  children: ReactNode
  currentTabs?: TCurrentTabs
}

const ProductsLayout = ({ children, currentTabs }: ProductsLayoutProps) => {

  return (
    <MainLayout>
      <div className='border-b py-4'>
        <Container>
          <div className='flex items-center gap-x-7'>
            <Link href={'/products/register'}>
              <span className={`text-sm ${currentTabs === 'register' ? 'text-red-500':'text-gray-500'}`}>상품 등록</span>
            </Link>
            |
            <Link href={'/products/manage'}>
              <span className={`text-sm ${currentTabs === 'manage' ? 'text-red-500':'text-gray-500'}`}>상품 관리</span>
            </Link>
            |
            <Link href={'/products/history'}>
              <span className={`text-sm ${currentTabs === 'history' ? 'text-red-500':'text-gray-500'}`}>구매 / 판매 내역</span>
            </Link>
          </div>
        </Container>
      </div>
      {children}
    </MainLayout>
  );
};

export default ProductsLayout;

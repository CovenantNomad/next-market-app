import { ReactNode } from 'react';
import Container from '@/components/layout/Container/Container';
import Search from './_components/Search';
import Link from 'next/link';
import { HomeIcon, MessageSquareMoreIcon, TagIcon } from 'lucide-react';

type HeaderProps = {
  children: ReactNode
}

const Header = ({ children }: HeaderProps) => {
  
  return (
    <header className='sticky top-0 z-10 bg-white border-b border-b-slate-300'>
      <Container>
        <div className='flex justify-between items-center py-8'>
          <Link href={'/'} prefetch={false}>
            <div className='cursor-pointer'>
              <span className='text-3xl font-bold'>🏪 중고장터</span>
            </div>
          </Link>
          <Search />
          <div className='flex items-center gap-x-4'>
            <Link href={'/products/register'}>
              <div className='flex items-center gap-x-2 cursor-pointer'>
                <TagIcon className='h-4 w-4'/>
                <span className='text-sm'>판매하기</span>
              </div>
            </Link>
            <span>|</span>
            <Link
              href={'/my-shop'}
              prefetch={false}
              className='flex items-center gap-x-2 cursor-pointer'
            >
              <HomeIcon className='h-4 w-4'/>
              <span className='text-sm'>내 상점</span>
            </Link>
            <span>|</span>
            <Link href={'/messages'}>
              <div className='flex items-center gap-x-2 cursor-pointer'>
                <MessageSquareMoreIcon className='h-4 w-4'/>
                <span className='text-sm'>채팅</span>
              </div>
            </Link>
          </div>
        </div>
      </Container>
      {children}
    </header>
  );
};

export default Header;

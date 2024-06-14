import { useState } from 'react';
import Link from 'next/link';
import { removeRecentItems } from '@/lib/localStorage';
import { XIcon } from 'lucide-react';

type RecentItemDetailProps = {
  id: string
  title: string
  price: number
  imageUrl: string
}

const RecentItemDetail = ({ id, title, price, imageUrl }: RecentItemDetailProps) => {
  const [ isHover, setIsHover ] = useState<boolean>(false)
  return (
    <div 
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Link href={`/products/${id}`}>
        {
          !isHover ? (
            <div className='w-16 h-16 border border-gray-300'>
              <img src={imageUrl} alt={title} className='w-full h-full' />
            </div>
          ) : (
            <div className='relative h-16 w-16'>
              <div className='absolute top-0 right-0 h-16 w-52 flex bg-white '>
                <div 
                  onClick={(e) => {
                    e.preventDefault()
                    removeRecentItems(id)
                  }}
                  className='absolute w-5 h-5 left-[-20px] bg-black flex justify-center items-center cursor-pointer'
                >
                  <XIcon className='h-4 w-4 text-white' />
                </div>
                <div className='flex-1 overflow-hidden flex flex-col justify-center items-start gap-y-3 px-2 border border-r-0 border-black'>
                  <span className='text-xs truncate'>{title}</span>
                  <span className='text-xs font-bold'>{price.toLocaleString()}원</span>
                </div>
                <div className='w-16 h-16 shrink-0 border-y border-r border-black'>
                  <img src={imageUrl} alt={title} className='w-full h-full' />
                </div>
              </div>
            </div>
          )
        }
      </Link>
    </div>
  );
};

export default RecentItemDetail;

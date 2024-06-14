import { Card } from '@/components/ui/card';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

type ProductCardProps = {
  title: string;
  price: number;
  createdAt: string;
  imageUrl: string;
  isSoldOut: boolean
}

dayjs.extend(relativeTime).locale('ko')

const ProductCard = ({ title, price, createdAt, imageUrl, isSoldOut }: ProductCardProps) => {
  return (
    <Card className='relative'>
      {isSoldOut && (
        <div className='absolute top-0 left-0 w-full h-full bg-slate-900/70 flex justify-center items-center text-white rounded-lg'>
          판매완료
        </div>
      )}
      <div 
        className='h-36 bg-cover bg-center rounded-t-lg'
        style={{ backgroundImage : `url(${imageUrl})`}}  
      />
      <div className='h-20 flex flex-col justify-center px-3'>
        <span className='text-ellipsis overflow-hidden whitespace-nowrap block'>{title}</span>
        <div className='flex justify-between items-center flex-wrap'>
          <p className='font-bold mt-1'>
            {price.toLocaleString()}
            <span className='text-sm font-normal ml-1'>원</span>
          </p>
          <span className='text-sm text-gray-300'>{dayjs(createdAt).fromNow()}</span>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

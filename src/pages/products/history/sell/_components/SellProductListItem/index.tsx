import Link from "next/link";

type SellProductListItemProps = {
  productId?: string
  imageUrl?: string
  title?: string
  price?: number
}

const SellProductListItem = ({ productId, title, price, imageUrl }: SellProductListItemProps) => {
  return (
    <div className='flex text-center border-y my-4 py-2'>
      <div className='w-28 h-28'>
        <img src={imageUrl} title={title} className='w-full h-full' />
      </div>
      <div className='flex-1 flex items-center justify-center'>
        <Link href={`/products/${productId}`}>
          <span>{title}</span>
        </Link>
      </div>
      <div className='w-28 flex items-center justify-center'>
        <span>{price ? price.toLocaleString() : 0}원</span>
      </div>
    </div>
  );
};

export default SellProductListItem;

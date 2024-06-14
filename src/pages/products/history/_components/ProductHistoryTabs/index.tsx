import Link from 'next/link';
import React from 'react';

type TCurrentTab = 'sell' | 'buy'

type ProductHistoryTabsProps = {
  currentTab: TCurrentTab
}

const ProductHistoryTabs = ({ currentTab }: ProductHistoryTabsProps) => {
  return (
    <div className='flex gap-x-2 py-5'>
      <Link href={'/products/history/sell'}>
        <span 
          className={`text-lg font-bold ${currentTab === 'sell' ? 'text-red-500' : 'text-gray-500'}`}
        >
          판매내역
        </span>
      </Link>
      <span className='text-lg'>|</span>
      <Link href={'/products/history/buy'}>
        <span 
          className={`text-lg font-bold ${currentTab === 'buy' ? 'text-red-500' : 'text-gray-500'}`}
        >
          구입내역
        </span>
      </Link>
    </div>
  );
};

export default ProductHistoryTabs;

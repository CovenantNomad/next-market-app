import ShopProfileImage from '@/components/shops/ShopProfileImage';
import { Skeleton } from '@/components/ui/skeleton';
import { checkIsImage } from '@/lib/image';
import supabase from '@/lib/supabase/browserClient';
import { getChatMessages } from '@/repository/chatMessages/getChatMessages';

import { getShop } from '@/repository/shops/getShop';
import { TChatMessage, TShop } from '@/types';
import camelcaseKeys from 'camelcase-keys';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type ChatRoomItemProps = {
  chatRoomId: string
  otherShopId: string
  isActive: boolean
}

const ChatRoomItem = ({ chatRoomId, otherShopId, isActive }: ChatRoomItemProps) => {
  const [ shop, setShop ] = useState<TShop>()
  const [ lastMessage, setLastMessage ] = useState<TChatMessage | null>()

  useEffect(() => {
    (async () => {      
      const [
        { data: shop },
        { data: [ lastMessage ]}
      ] = await Promise.all([
        getShop(supabase, otherShopId),
        getChatMessages(supabase, { chatRoomId, fromIndex: 0, toIndex: 1 })
      ])
      setShop(shop)
      setLastMessage(lastMessage === undefined ? null : lastMessage)
    })()

  }, [])

  useEffect(() => {
    const subscribeChat = supabase.channel(`preview_on_${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_room=eq.${chatRoomId}`
        },
        payload => {
          setLastMessage(camelcaseKeys(payload.new) as TChatMessage)
        }
      )

    subscribeChat.subscribe()

    return () => {
      subscribeChat.unsubscribe()
    }

  }, [chatRoomId])

  if (shop === undefined || lastMessage === undefined) {
    return (
      <div className="h-88 flex items-center space-x-4 py-4 px-3">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[360px]" />
        </div>
      </div>
    )
  }

  return (
    <Link href={`/messages/${chatRoomId}`} prefetch={false} shallow>
      <div className={`flex py-4 hover:bg-gray-100 px-3 ${isActive && 'bg-gray-200 hover:bg-gray-200'}`}>
        <div className='pr-3'>
          <ShopProfileImage imageUrl={shop.imageUrl || undefined} />
        </div>
        <div className='flex flex-col gap-y-1 px-3 flex-1 w-0'>
          <span className='text-lg font-bold'>{shop.name}</span>
          <span className='text-sm text-gray-500 truncate'>
            {lastMessage 
              ? checkIsImage(lastMessage.message) 
                ? '[이미지]' 
                : lastMessage.message 
              : '메시지가 없습니다'
            }
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ChatRoomItem;

import Container from "@/components/layout/Container/Container";
import MainLayout from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";
import { getChatRooms } from "@/repository/chatRooms/getChatRooms";
import { getMe } from "@/repository/me/getMe";
import { TChatRoom } from "@/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ChatRoomItem from "../_components/ChatRoomItem";
import { useRouter } from "next/router";
import ChatRoom from "../_components/ChatRoom";
import { Virtuoso } from "react-virtuoso";
import { AuthError } from "@/lib/error";
import getServerSupabase from "@/lib/supabase/serverClient";
import { useCallback, useEffect, useState } from "react";
import supabase from "@/lib/supabase/browserClient";


const MessagePage = ({
  shopId,
  chatRooms: initialChatRooms
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  const [ chatRooms, setChatRooms ] = useState(initialChatRooms)

  const currentChatRoomId = router.query.chatRoomId?.[0]
  const currentChatRoom = chatRooms.find(({ id }) => id === currentChatRoomId)

  const onUpdateChatRoomsHandler = useCallback(async () => {
    const { data } = await getChatRooms(supabase, shopId)
    setChatRooms(data)
  }, [shopId])

  useEffect(() => {
    const subscribeChatRoomsFromMe = supabase.channel(`chat_rooms_from_${shopId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_rooms',
          filter: `from_shop_id=eq.${shopId}`
        },
        () => onUpdateChatRoomsHandler()
      )

    const subscribeChatRoomsToMe = supabase.channel(`chat_rooms_to_${shopId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_rooms',
          filter: `to_shop_id=eq.${shopId}`
        },
        () => onUpdateChatRoomsHandler()
      )

      subscribeChatRoomsFromMe.subscribe()
      subscribeChatRoomsToMe.subscribe()

    return () => {
      subscribeChatRoomsFromMe.unsubscribe()
      subscribeChatRoomsToMe.unsubscribe()
    }

  }, [shopId, onUpdateChatRoomsHandler])
  
  return (
    <MainLayout>
      <div className="bg-gray-100">
        <Container>
          <div className="flex">
            <div 
              className={cn(
                'flex w-1/2 overflow-scroll bg-white border-l', 
                'min-h-[calc(100vh-48px-103px-96px)]',
                'max-h-[calc(100vh-48px-103px-96px)]'
              )}
            >
              {chatRooms.length == 0 ? (
                <div className="w-full h-full flex justify-center items-center">
                  <span className="gray text-2xl">대화방이 없습니다</span>
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-4">
                  <Virtuoso 
                    data={chatRooms}
                    itemContent={
                      (_, { id, fromShopId, toShopId}) => (
                        <ChatRoomItem 
                          key={id}
                          chatRoomId={id}
                          isActive={currentChatRoomId === id}
                          otherShopId={fromShopId === shopId ? toShopId : fromShopId}
                        />
                      )
                    }
                    initialTopMostItemIndex={Math.max(
                      chatRooms.findIndex(({ id }) => id === currentChatRoomId),
                      0
                    )}
                  />
                </div>
              )}
            </div>
            <div 
              className={cn(
                'w-1/2 overflow-scroll bg-white border-x border-gray-300', 
                'min-h-[calc(100vh-48px-103px-96px)]',
                'max-h-[calc(100vh-48px-103px-96px)]'
              )}
            >
              {!currentChatRoom ? (
                <div className="h-full flex justify-center items-center">
                  <span className="text-gray-500">대화를 선택해주세요</span>
                </div>
              ) : (
                <ChatRoom 
                  chatRoomId={currentChatRoom.id}
                  myShopId={shopId}
                  counterShopId={
                    currentChatRoom.fromShopId === shopId 
                    ? currentChatRoom.toShopId 
                    : currentChatRoom.fromShopId
                  }
                />
              )}
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};

export default MessagePage;

export const getServerSideProps: GetServerSideProps<{
  shopId: string
  chatRooms: TChatRoom[]
}> = async (context) => {
  try {
    const supabase = getServerSupabase(context)
    const { data: { shopId } } = await getMe(supabase)

    if (!shopId) {
      throw new AuthError('로그인이 필요합니다')
    }

    const { data: chatRooms } = await getChatRooms(supabase, shopId)

    return {
      props: {
        shopId,
        chatRooms
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
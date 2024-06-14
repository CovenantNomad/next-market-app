import { cn } from "@/lib/utils";

import { TChatMessage } from "@/types";
import { useEffect, useRef, useState } from "react";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import { checkIsImage } from "@/lib/image";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import Spinner from "@/components/common/Spinner";
import supabase from "@/lib/supabase/browserClient";
import { getChatMessagesCount } from "@/repository/chatMessages/getChatMessageCount";
import { getChatMessages } from "@/repository/chatMessages/getChatMessages";
import camelcaseKeys from "camelcase-keys";

dayjs.extend(relativeTime).locale('ko')

type ChatMessagesProps = {
  chatRoomId: string
  myShopId: string
  counterShopId: string
}

const ChatMessages = ({ chatRoomId, myShopId, counterShopId }: ChatMessagesProps) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [ count, setCount ] = useState<number>()
  const [ firstItemIndex, setFirstTimeIndex ] = useState<number>()
  const [ messages, setMessages ] = useState<TChatMessage[]>([])
  const [ isLoading, setIsLoading ] = useState(false)
  const [ hasNewMessage, setHasNewMessage ] = useState(false)


  const onGetPrevMessageHandler = async (index: number) => {
    if (count === undefined) {
      return
    }

    const fromIndex = count - index
    const toIndex = fromIndex + 10

    setIsLoading(true)
    const { data } = await getChatMessages(supabase, {
      chatRoomId,
      fromIndex: fromIndex,
      toIndex: toIndex,
    })

    setMessages(prev => [...data.reverse(), ...(prev || [])])
    setFirstTimeIndex(Math.max(0, count - toIndex))
    setIsLoading(false)
  }


  useEffect(() => {
    (async () => {
      const [
        { data: messages },
        { data: count}
      ] = await Promise.all([
        getChatMessages(supabase, {
          chatRoomId,
          fromIndex: 0,
          toIndex: 10,
        }),
        getChatMessagesCount(supabase, chatRoomId)
      ])

      setMessages([...messages.reverse()])
      const firstItemIndex = count - messages.length
      setFirstTimeIndex(count - messages.length)
      setCount(count)

      virtuosoRef.current?.scrollToIndex({
        index: firstItemIndex,
        align: 'end'
      })
    })()

  }, [chatRoomId])

  useEffect(() => {
    const subscribeChat = supabase.channel(`chat_on_${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_room=eq.${chatRoomId}`
        },
        payload => {
          setMessages((prev) => [...prev, camelcaseKeys(payload.new) as TChatMessage])
          setCount((prev = 0) => prev + 1)
          setHasNewMessage(true)
          setTimeout(() => {
            setHasNewMessage(false)
          }, 3000)
        }
      )

    subscribeChat.subscribe()

    return () => {
      subscribeChat.unsubscribe()
    }

  }, [chatRoomId])

  return (
    <div className="relative flex-1 overflow-scroll px-3">
      {isLoading && (
        <div className="absolute top-1 left-0 w-full flex justify-center items-center z-50">
          <Spinner hasText={false} />
        </div>
      )}
      {
        hasNewMessage && (
          <div className="absolute bottom-1 left-0 w-full flex justify-center items-center z-30">
            <button 
              type="button" 
              onClick={() => {
                virtuosoRef.current?.scrollToIndex({
                  index: messages.length - 1,
                  align: 'end'
                })
                setHasNewMessage(false)
              }}
              className="rounded-full bg-gray-500/40 mx-auto px-3 py-1"
            >
              <span className="text-sm text-white">새 메세지 보기</span>
            </button>
          </div>
        )
      }
      {messages.length === 0 ? (
        <div className="h-full flex justify-center items-center">
          <span>메세지가 없습니다</span>
        </div>
      ) : (
        <Virtuoso
          ref={virtuosoRef} 
          data={messages}
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={messages.length - 1}
          startReached={onGetPrevMessageHandler}
          itemContent={(_, { id, message, createdBy, createdAt }) => {
            const isMyMessage = createdBy === myShopId

            return (
              <div
                key={id} 
                className="flex flex-col"
              >
                <div 
                  
                  className={cn(
                    'w-72 flex flex-col py-1 px-2 my-2',
                    isMyMessage && 'border-r-2 border-gray-200 self-end text-right',
                    !isMyMessage && 'border-l-2 border-gray-200'
                  )}
                >
                  <div>
                    {checkIsImage(message) ? (
                      <img src={message} alt="" />
                    ) : (
                      <span className="text-sm">{message}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">{dayjs(createdAt).fromNow()}</span>
                  </div>
                </div>
              </div>
            )
          }}
        />
      )}
      
    </div>
  );
};

export default ChatMessages;

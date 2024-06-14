import Spinner from "@/components/common/Spinner";
import { getShop } from "@/repository/shops/getShop";
import { TShop } from "@/types";
import { CameraIcon } from "lucide-react";
import { ChangeEventHandler, FormEventHandler, useEffect, useRef, useState } from "react";
import ChatMessages from "../ChatMessages";
import supabase from "@/lib/supabase/browserClient";
import { createChatMessage } from "@/repository/chatMessages/createChatMessage";
import { uploadImage } from "@/repository/common/uploadImage";

type ChatRoomProps = {
  chatRoomId: string;
  myShopId: string;
  counterShopId: string;
}

const ChatRoom = ({ chatRoomId, myShopId, counterShopId }: ChatRoomProps) => {
  const [ counterShop, setCounterShop ] = useState<TShop>()
  const ref = useRef<HTMLInputElement>(null)

  const onTextSubmitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (ref.current) {
      await createChatMessage(supabase, { 
        chatRoomId, 
        message: ref.current.value 
      })
      ref.current.value = ''
      ref.current.focus()
    }
  }

  const onImageSubmitHandler: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files?.[0]) {
      try {
        const { data: { imageUrl } } = await uploadImage(supabase, e.target.files[0])
        await createChatMessage(supabase, { 
          chatRoomId, 
          message: imageUrl 
        })
        
      } catch (error) {
        alert('이미지 업로드에 실패했습니다')
        
      } finally {
        e.target.value = ''
      }
    }
  }

  useEffect(() => {
    (async () => {
      const { data: counterShop } = await getShop(supabase, counterShopId)
      setCounterShop(counterShop)

    })()

  }, [counterShopId])


  if (!counterShop) {
    return (
      <div className="h-full flex-1 flex justify-center items-center">
        <Spinner />
      </div>
    )
  }


  return (
    <div className="relative flex flex-col h-full w-full">
      <div className="sticky top-0 left-0 w-full h-[60px] py-4 px-3 border-b z-50">
        <span className="text-lg font-bold">{counterShop.name}</span>
      </div>
      <ChatMessages 
        chatRoomId={chatRoomId}
        myShopId={myShopId}
        counterShopId={counterShopId}
      />
      <div className="w-full px-3 py-2">
        <form onSubmit={onTextSubmitHandler} className="flex items-center justify-center bg-gray-100 rounded-3xl py-2 px-3">
          <div className="flex-1">
            <input
              ref={ref}
              type="text"
              autoComplete="off" 
              placeholder="메세지를 입력하세요"
              className="w-full outline-0 bg-transparent text-sm text-black px-2"
            />
          </div>
          <div>
            <label htmlFor="image">
              <CameraIcon className="h-6 w-6 text-gray-500" />
            </label>
            <input
              id="image"
              type="file"
              accept='image/webp, image/png, image/jpg, image/jpeg' 
              hidden={true}
              onChange={onImageSubmitHandler}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;

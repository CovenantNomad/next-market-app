import { ChangeEventHandler, FormEvent, FormEventHandler, useRef, useState } from "react";
import Container from "@/components/layout/Container/Container";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TCity, cities, getDistricts } from "@/lib/address";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import ProductsLayout from "../ProductsLayout";
import dynamic from "next/dynamic";
import MarkdownSkeleton from "@/components/shared/MarkdownSkeleton/MarkdownSkeleton";
import { uploadImage } from "@/repository/common/uploadImage";
import supabase from "@/lib/supabase/browserClient";
import { createProduct } from "@/repository/products/createProduct";
import { useRouter } from "next/router";
import { updateProduct } from "@/repository/products/updateProduct";

type Props = {
  id: string
  imageUrls: string[]
  title: string
  isUsed: boolean
  isChangeable: boolean
  price: number
  city: TCity
  district: string
  description: string
  tags: string[]
}

const MarkdownEditor = dynamic(
  () => import('@/components/shared/MarkdownEditor'),
  {
    ssr: false,
    loading: () => <MarkdownSkeleton />
  }
)



const ProductForm = ({
  id: defaultId,
  imageUrls: defaultImageUrls,
  title: defaultTitle,
  isUsed: defaultIsUsed,
  isChangeable: defaultIsChangeable,
  price: defaultPrice,
  city: defaultCity,
  district: defaultDistrict,
  description: defaultDescription,
  tags: defaultTags,
} : Partial<Props>) => {
  const formType = defaultId ? 'edit' : 'register'
  const router = useRouter()
  const tagInputRef = useRef<HTMLInputElement>(null)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ tags, setTags ] = useState<string[]>(defaultTags || [])
  const [ city, setCity ] = useState<TCity| undefined>(defaultCity)
  const [ description, setDescription ] = useState<string>(defaultDescription || '')
  const [ imageUrls, setImageUrls] = useState<string[]>(defaultImageUrls || [])

  const onUploadImageHandler: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files?.[0]){
      const imageFile = e.target.files[0]
      const { data: { imageUrl }} = await uploadImage(supabase, imageFile)
      e.target.value = ''
      setImageUrls(prev => [imageUrl, ...prev])
    }
  }

  const onAddTagsHandler = () => {
    if (!tagInputRef.current) {
      return;
    }

    const tagValue = tagInputRef.current.value.trim()

    tagInputRef.current.value = ''

    if (tags.length >= 5) {
      return
    }

    setTags(prevTags => {
      if (!prevTags.find(tag => tag === tagValue)) {
        return [...prevTags, tagValue]
      }
      return prevTags
    })
  }

  const onRemoveTagHandler = (tag: string) => {
    setTags(((prevTags) => prevTags.filter((prevTag) => prevTag !== tag)))
  }

  const onRemoveImage = (imageUrl: string) => {
    setImageUrls((prevImages => prevImages.filter(image => image !== imageUrl)))
  }

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      const formData = new FormData(e.currentTarget)

      const tags = formData.getAll('tags') as string[]
      const imageUrls = formData.getAll('imageUrls') as string[]

      if (imageUrls.length === 0) {
        alert('상품 이미지를 1개 이상 등록해주세요.')
        setIsLoading(false)
        return
      }

      const id = formData.get('id') as string
      const title = formData.get('title') as string
      const price = parseInt(formData.get('price') as string)
      const city = formData.get('city') as string
      const district = formData.get('district') as string
      const address = `${city} ${district}`
      const description = formData.get('description') as string
      const isChangeable = formData.get('isChangeable') === 'y'
      const isUsed = formData.get('isUsed') === 'y'

      if (formType === 'register') {
        const { data } = await createProduct(supabase, {
          title, 
          price, 
          address, 
          description, 
          isChangeable, 
          isUsed, 
          tags, 
          imageUrls
        })
  
        router.push(`/products/${data.id}`)

      } else {
        const { data } = await updateProduct(supabase, {
          id,
          title, 
          price, 
          address, 
          description, 
          isChangeable, 
          isUsed, 
          tags, 
          imageUrls
        })

        router.push(`/products/${data.id}`)
      }

    } catch (error) {
      if (formType === 'register') {
        alert('상품 등록에 실패했습니다')
      } else {
        alert('상품 수정에 실패했습니다')
      }
      

    } finally {
      setIsLoading(false)
    }
  }


  return (
    <ProductsLayout currentTabs={formType ? undefined : "register"}>
      <div className='pt-10'>
        <Container>
          <div className="pt-6 pb-4 border-b-2 border-black">
            <span className="text-2xl mr-4">{formType === 'edit' ? '수정하기' : '상품정보'}</span>
            <span className="text-base text-red-500">* 필수정보</span>
          </div>
        </Container>
        <form onSubmit={onSubmitHandler} className="mt-10">
          <Container>
            <input type="hidden" name="id" defaultValue={defaultId} />
            {/* 상품이미지 */}
            <div className="flex border-b border-gray-300 pt-5 pb-7">
              <div className="w-40">
                <span className="text-lg">상품 이미지</span>
                <span className="text-lg text-gray-500 font-light">({imageUrls.length}/3)</span>
                <span className="text-base text-red-500">*</span>
              </div>
              <div className="flex gap-x-2">
                {imageUrls.map((imageUrl, index) => (
                  <div key={index} className="relative w-40 h-40 border">
                    <img src={imageUrl} alt="" className="w-full h-full" />
                    <button 
                      type="button"
                      onClick={() => onRemoveImage(imageUrl)} 
                      className="absolute top-1 right-1 w-6 h-6 flex justify-center items-center rounded-full bg-black/50"
                    >
                      <XIcon className="h-4 w-4 text-white" />
                    </button>
                    <input type="text" name="imageUrls" defaultValue={imageUrl} hidden />
                  </div>
                ))}
                {imageUrls.length < 3 && (
                  <>
                    <label
                      htmlFor="productImage" 
                      className="w-40 h-40 border flex justify-center items-center cursor-pointer"
                    >
                      파일업로드하기
                    </label>
                    <input 
                      id="productImage" 
                      type="file" 
                      accept='image/webp, image/png, image/jpg, image/jpeg' 
                      hidden
                      disabled={imageUrls.length >= 3} 
                      onChange={onUploadImageHandler}
                    />
                  </>
                )}
              </div>
            </div>
            {/* 상품명 */}
            <div className="flex items-center border-b border-gray-300 py-7">
              <div className="w-40">
                <span className="text-lg">상품명</span>
                <span className="text-base text-red-500">*</span>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="title" 
                  className="sr-only"
                >
                  상품명
                </label>
                <Input 
                  id="title"
                  name="title" 
                  type="text" 
                  defaultValue={defaultTitle}
                  placeholder="상품명을 입력해주세요"
                  className="w-full"
                  required
                />
              </div>
            </div>
            {/* 상품상태 */}
            <div className="flex items-center border-b border-gray-300 py-7">
              <div className="w-40">
                <span className="text-lg">상품상태</span>
                <span className="text-base text-red-500">*</span>
              </div>
              <div className="flex-1">
                <Select 
                  name="isUsed" 
                  required
                  defaultValue={defaultIsUsed === undefined ? undefined : defaultIsUsed ? 'y' : 'n'}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="상품상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="n">신품</SelectItem>
                    <SelectItem value="y">중고</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* 교환여부 */}
            <div className="flex items-center border-b border-gray-300 py-7">
              <div className="w-40">
                <span className="text-lg">교환</span>
                <span className="text-base text-red-500">*</span>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="isChangeable" 
                  className="sr-only"
                >
                  가격
                </label>
                <Select
                  name="isChangeable" 
                  required
                  defaultValue={defaultIsChangeable === undefined ? undefined : defaultIsChangeable ? 'y' : 'n'}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="교환가능 여부" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="y">가능</SelectItem>
                    <SelectItem value="n">불가</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* 가격 */}
            <div className="flex items-center border-b border-gray-300 py-7">
              <div className="w-40">
                <span className="text-lg">가격</span>
                <span className="text-base text-red-500">*</span>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="price" 
                  className="sr-only"
                >
                  가격
                </label>
                <Input
                  id="price" 
                  name="price" 
                  type="number" 
                  placeholder="가격을 입력해주세요"
                  className="w-full"
                  required
                  defaultValue={defaultPrice}
                />
              </div>
            </div>
            {/* 거래지역 */}
            <div className="flex items-center border-b border-gray-300 py-7">
              <div className="w-40">
                <span className="text-lg">거래지역</span>
                <span className="text-base text-red-500">*</span>
              </div>
              <div className={`flex-1 flex gap-x-4`}>
                <label
                  htmlFor="city" 
                  className="sr-only"
                >
                  거래지역
                </label>
                <Select 
                  name="city"
                  required
                  onValueChange={v => {
                    if (v === '선택') {
                      setCity(undefined)
                    } else {
                      setCity(v as TCity)
                    }
                  }}
                  defaultValue={defaultCity}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="시/도" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'선택'}>선택</SelectItem>
                    {cities.map((city, index) => (
                      <SelectItem key={index} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {
                  !!city && (
                    <Select 
                      name="district" 
                      required
                      defaultValue={defaultDistrict}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="시/군/구" />
                      </SelectTrigger>
                      <SelectContent>
                        {getDistricts(city).map((district, index) => (
                          <SelectItem key={index} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                }
              </div>
            </div>
            {/* 상품태그 */}
            <div className="flex border-b border-gray-300 py-7">
              <div className="w-40">
                <span className="text-lg">상품태그</span>
              </div>
              <div className="flex-1 ">
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag, index) => (
                    <div 
                      key={index}
                      className="flex justify-center items-center gap-x-2 bg-purple-200 rounded-lg px-2 py-0.5"
                    >
                      <span className="text-sm leading-none">{tag}</span>
                      <XIcon 
                        onClick={() => onRemoveTagHandler(tag)}
                        className="h-4 w-4 cursor-pointer" 
                      />
                      <input type="text" name="tags" defaultValue={tag} hidden />
                    </div>
                  ))}
                </div>
                <div className="flex gap-x-2 mt-4">
                  <Input 
                    name="tags" 
                    disabled={tags.length >= 5}
                    placeholder="상품태그를 입력해주세요 (최대 5개)"
                    className="w-96"
                    ref={tagInputRef}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        onAddTagsHandler()
                        return false
                      }
                    }}
                  />
                  <Button
                    type="button" 
                    disabled={tags.length >= 5}
                    onClick={() => {onAddTagsHandler()}}
                  > 
                    입력 
                  </Button>
                </div>
              </div>
            </div>
            {/* 상품설명 */}
            <div className="flex pt-5 pb-7">
              <div className="w-40">
                <span className="text-lg">상품설명</span>
                <span className="text-base text-red-500">*</span>
              </div>
              <div className="flex-1">
                <MarkdownEditor 
                  initialValue={description}
                  onChangeHandler={
                    (value) => setDescription(value)
                  }
                />
                <input type="text" value={description} name="description" readOnly required className="opacity-0 h-1 w-1" />
              </div>
            </div>
          </Container>
          <div className="sticky bottom-0 z-50 bg-gray-100 py-4 border-t border-gray-300">
            <Container>
              <div className="flex justify-end">
                <Button className="bg-red-500 w-28 h-12" disabled={isLoading}>
                  {isLoading ? '제출중..' : formType === 'edit' ? '수정하기' : '등록하기'}
                </Button>
              </div>
            </Container>
          </div>
        </form>
      </div>
    </ProductsLayout>
  );
};

export default ProductForm;
import { TChatMessage, TChatRoom, TFollow, TLike, TProduct, TReview, TShop } from "@/types"
import { fakerKO as faker } from '@faker-js/faker'

export function getMockProductData(defaultValue?: Partial<TProduct>) {
  const data: TProduct = {
    id: defaultValue?.id ?? faker.string.uuid(),
    title: defaultValue?.title ?? faker.commerce.product(),
    price: defaultValue?.price ?? Number(faker.commerce.price({ min: 1000, max: 1000000 })),
    address: defaultValue?.address ?? '서울특별시 중구',
    description: defaultValue?.description ?? faker.lorem.sentences(10, '\n'),
    imageUrls: defaultValue?.imageUrls ?? Array.from({ length: faker.number.int({ min:1, max: 5})}).map(() => faker.image.dataUri()),
    isChangeable: defaultValue?.isChangeable ?? faker.datatype.boolean(),
    isUsed: defaultValue?.isUsed ?? faker.datatype.boolean(),
    tags: defaultValue?.tags ?? (faker.datatype.boolean() ? Array.from({ length: faker.number.int({ min:1, max: 5})}).map(() => faker.lorem.word()) : null),
    createdAt: defaultValue?.createdAt ?? faker.date.past().toDateString(),
    createdBy: defaultValue?.createdBy ?? faker.string.uuid(),
    purchaseBy: defaultValue?.purchaseBy ?? (faker.datatype.boolean() ? faker.string.uuid() : null),
  }

  return data
}

export function getMockShopData(defaultValue?: Partial<TShop>) {
  const data: TShop = {
    id: defaultValue?.id ?? faker.string.uuid(),
    name: defaultValue?.name ?? faker.commerce.department(),
    introduce: defaultValue?.introduce ?? faker.lorem.sentences(3, '\n'),
    imageUrl: defaultValue?.imageUrl ?? faker.image.dataUri(),
    createdAt: defaultValue?.createdAt ?? faker.date.past().toDateString(),
  }

  return data
}

export function getMockReviewData(defaultValue?: Partial<TReview>) {
  const data: TReview = {
    id: defaultValue?.id ?? faker.string.uuid(),
    contents: defaultValue?.contents ?? faker.lorem.sentences(3, '\n'),
    productId: defaultValue?.productId ?? faker.string.uuid(),
    createdBy: defaultValue?.createdBy ?? faker.string.uuid(),
    createdAt: defaultValue?.createdAt ?? faker.date.past().toDateString(),
  }

  return data
}

export function getMockLikeData(defaultValue?: Partial<TLike>) {
  const data: TLike = {
    id: defaultValue?.id ?? faker.string.uuid(),
    productId: defaultValue?.productId ?? faker.string.uuid(),
    createdBy: defaultValue?.createdBy ?? faker.string.uuid(),
    createdAt: defaultValue?.createdAt ?? faker.date.past().toDateString(),
  }

  return data
}

export function getMockFollowData(defaultValue?: Partial<TFollow>) {
  const data: TFollow = {
    id: defaultValue?.id ?? faker.string.uuid(),
    followingShopId: defaultValue?.followingShopId ?? faker.string.uuid(),
    createdBy: defaultValue?.createdBy ?? faker.string.uuid(),
    createdAt: defaultValue?.createdAt ?? faker.date.past().toDateString(),
  }

  return data
}

export function getMockChatRoomData(defaultValue?: Partial<TChatRoom>) {
  const data: TChatRoom = {
    id: defaultValue?.id ?? faker.string.uuid(),
    fromShopId: defaultValue?.fromShopId ?? faker.string.uuid(),
    toShopId: defaultValue?.toShopId ?? faker.string.uuid(),
    createdAt: defaultValue?.createdAt ?? faker.date.past().toDateString(),
  }

  return data
}

export function getMockChatMessageData(defaultValue?: Partial<TChatMessage>) {
  const data: TChatMessage = {
    id: defaultValue?.id ?? faker.string.uuid(),
    chatRoomId: defaultValue?.chatRoomId ?? faker.string.uuid(),
    message: defaultValue?.message ?? (faker.datatype.boolean() ? faker.lorem.sentences(3, '\n'): faker.image.dataUri()),
    createdBy: defaultValue?.createdBy ?? faker.string.uuid(),
    createdAt: defaultValue?.createdAt ?? faker.date.past().toDateString(),
  }

  return data
}

export function getMockImageDataUri() {
  return faker.image.dataUri()
}


// timeOute 함수를 실행하면 promise를 반환하는데, 이 프로미스는 setTimeOut에 의해서 ms 이후 resolve가 된다.
export const timeOut = (ms = 3000) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})
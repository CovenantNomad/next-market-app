export type TProduct = {
  id: string;
  title: string;
  price: number;
  address: string;
  description: string;
  imageUrls: string[];
  isChangeable: boolean;
  isUsed: boolean;
  tags: string[] | null;
  createdAt: string;
  createdBy: string;
  purchaseBy: string | null;
}

export type TShop = {
  id: string;
  name: string;
  imageUrl: string | null;
  introduce: string | null;
  createdAt: string;
}

export type TReview = {
  id: string;
  contents: string;
  productId: string;
  createdBy: string;
  createdAt: string;
}

export type TLike = {
  id: string;
  productId: string;
  createdBy: string;
  createdAt: string;
}

export type TFollow = {
  id: string;
  followingShopId: string;
  createdBy: string;
  createdAt: string;
}

export type TChatRoom = {
  id: string;
  fromShopId: string;
  toShopId: string;
  createdAt: string;
}

export type TChatMessage = {
  id: string;
  chatRoomId: string;
  message: string;
  createdBy: string;
  createdAt: string;
}
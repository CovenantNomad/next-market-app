import { GetServerSideProps } from "next"

export default function ShopPage() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: `/shops/${context.query.shopId}/products`,
      permanent: false
    }
  }
}
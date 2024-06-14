import { GetServerSideProps } from "next"

export default function ProductPage() {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/products/manage',
      permanent: false
    }
  }
}
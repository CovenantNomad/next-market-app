import { GetServerSideProps } from "next"

export default function ProductHistoryPage() {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/products/history/sell',
      permanent: false
    }
  }
}
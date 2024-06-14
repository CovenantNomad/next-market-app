import Container from "@/components/layout/Container/Container";
import MainLayout from "@/components/layout/MainLayout";
import LoginPanel from "@/components/layout/MainLayout/_components/LoginPanel";
import getServerSupabase from "@/lib/supabase/serverClient";
import { getMe } from "@/repository/me/getMe";
import { GetServerSideProps } from "next";

type LoginPageProps = {}

const LoginPage = ({}: LoginPageProps) => {
  return (
    <MainLayout>
      <Container>
        <div className="flex justify-center items-center py-32">
          <LoginPanel />
        </div>
      </Container>
    </MainLayout>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = getServerSupabase(context)
  const { data: { shopId }} = await getMe(supabase)

  if (shopId) {
    const destination = context.query.next 
      ? decodeURIComponent(context.query.next as string)
      : '/'

    return {
      redirect: {
        destination: destination,
        permanent: false
      }
    } 
  }

  return {
    props: {}
  } 
}

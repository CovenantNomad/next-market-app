import Container from '@/components/layout/Container/Container';
import RecentItem from './_components/RecentItem';
import LikeItem from './_components/LikeItem';

type AsideProps = {}

const Aside = ({}: AsideProps) => {
  return (
    <Container className='relative'>
      <aside className='absolute top-8 right-0 w-24 2xl:right-[-30px] 2xl:translate-x-[100%]'>
        <LikeItem />
        <RecentItem />
      </aside>
    </Container>
  );
};

export default Aside;

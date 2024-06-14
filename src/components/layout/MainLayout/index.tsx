import { ReactNode } from 'react';
import MainWrapper from '../MainWrapper';
import Navbar from './_components/Navbar';
import Header from './_components/Header';
import Footer from './_components/Footer';
import Aside from './_components/Aside';

type MainLayoutProps = {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <MainWrapper>
      <Navbar />
      <Header>
        <Aside />
      </Header>    
      <section className='relative'>
        {children}
      </section>
      <Footer />
    </MainWrapper>
  );
};

export default MainLayout;

import Container from '@/components/layout/Container/Container';
import Login from '../Login';


type NavbarProps = {}

const Navbar = ({}: NavbarProps) => {
  return (
    <nav className='h-12 border-b border-b-slate-300'>
      <Container className='h-full'>
        <div className='h-full flex justify-end items-center'>
          <Login />
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;

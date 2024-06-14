import Container from '@/components/layout/Container/Container';
import React from 'react';

type FooterProps = {}

const Footer = ({}: FooterProps) => {
  return (
    <footer className='h-24 border-t border-t-slate-300 pb-8'>
      <Container className='h-full'>
        <div className='h-full flex items-center gap-x-5'>
          <span>회사소개</span> |
          <span>이용약관</span> |
          <span>운영정책</span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

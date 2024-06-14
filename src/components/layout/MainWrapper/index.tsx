import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MainWrapperProps = {
  children: ReactNode
  className?: string
}

const MainWrapper = ({ children, className }: MainWrapperProps) => {
  return (
    <main className={cn('w-full', className)}>
      {children}
    </main>
  );
};

export default MainWrapper;

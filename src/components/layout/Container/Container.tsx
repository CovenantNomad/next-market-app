import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode
  className?: string
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn('w-full max-w-[1280px] min-w-[1000px] mx-auto px-10 xl:px-0', className)}>
      {children}
    </div>
  );
};

export default Container;

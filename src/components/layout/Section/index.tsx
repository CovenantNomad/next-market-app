import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode
  className?: string
}

const Section = ({ children, className }: SectionProps) => {
  return (
    <section className={cn('w-full', className)}>
      {children}
    </section>
  );
};

export default Section;

import * as React from 'react';

import { cn } from '@/lib/utils';

function Container({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="container"
      className={cn(
        'mx-auto w-full max-w-[var(--container-max-width)] px-4 md:px-6 lg:px-8',
        className,
      )}
      {...props}
    />
  );
}

function PageWrapper({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="page-wrapper"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-[var(--section-gap)] bg-background py-6 md:py-8',
        className,
      )}
      {...props}
    />
  );
}

function SectionWrapper({ className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section
      data-slot="section-wrapper"
      className={cn('flex flex-col gap-[var(--section-gap)]', className)}
      {...props}
    />
  );
}

export { Container, PageWrapper, SectionWrapper };

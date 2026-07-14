import * as React from 'react';

import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

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

interface PageHeaderProps extends React.ComponentProps<'header'> {
  title: string;
  description?: string;
}

function PageHeader({
  className,
  title,
  description,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-start md:justify-between',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-2">
        <Typography variant="heading">{title}</Typography>
        {description ? (
          <Typography variant="body" tone="secondary">
            {description}
          </Typography>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </header>
  );
}

function ContentWrapper({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="content-wrapper"
      className={cn('flex min-h-0 flex-1 flex-col gap-6', className)}
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

export {
  Container,
  PageWrapper,
  PageHeader,
  ContentWrapper,
  SectionWrapper,
};

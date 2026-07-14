import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const typographyVariants = cva('text-text-primary', {
  variants: {
    variant: {
      display: 'text-[length:var(--text-display)] font-bold leading-tight',
      heading: 'text-[length:var(--text-heading)] font-semibold leading-tight',
      section: 'text-[length:var(--text-section)] font-semibold leading-snug',
      'card-title':
        'text-[length:var(--text-card-title)] font-semibold leading-snug',
      body: 'text-[length:var(--text-body)] font-normal leading-relaxed',
      small: 'text-[length:var(--text-small)] font-normal leading-normal',
      caption: 'text-[length:var(--text-caption)] font-normal leading-normal',
    },
    tone: {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      inherit: 'text-inherit',
    },
  },
  defaultVariants: {
    variant: 'body',
    tone: 'primary',
  },
});

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'label';

const defaultElement: Record<
  NonNullable<VariantProps<typeof typographyVariants>['variant']>,
  TypographyElement
> = {
  display: 'h1',
  heading: 'h1',
  section: 'h2',
  'card-title': 'h3',
  body: 'p',
  small: 'p',
  caption: 'span',
};

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: TypographyElement;
  htmlFor?: string;
}

function Typography({
  className,
  variant = 'body',
  tone = 'primary',
  as,
  htmlFor,
  ...props
}: TypographyProps) {
  const Comp = as ?? defaultElement[variant ?? 'body'];

  return (
    <Comp
      data-slot="typography"
      className={cn(typographyVariants({ variant, tone, className }))}
      htmlFor={htmlFor}
      {...props}
    />
  );
}

export { Typography, typographyVariants };

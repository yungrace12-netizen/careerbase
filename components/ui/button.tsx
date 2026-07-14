import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2',
    'rounded-[var(--radius-button)] border border-transparent',
    'text-body font-medium whitespace-nowrap',
    'transition-all outline-none select-none',
    'duration-[var(--duration-fast)]',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    "[&_svg:not([class*='size-'])]:size-5",
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
        secondary:
          'border-border bg-secondary text-secondary-foreground hover:bg-muted',
        danger:
          'bg-danger text-danger-foreground hover:bg-danger/90 active:bg-danger/80',
        ghost: 'bg-transparent text-text-primary hover:bg-muted',
      },
      size: {
        default: 'h-[var(--button-height)] px-6',
        icon: 'size-[var(--button-height)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'primary',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

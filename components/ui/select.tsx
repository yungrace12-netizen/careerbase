import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

export interface SelectProps
  extends Omit<React.ComponentProps<'select'>, 'onChange'> {
  label?: string;
  error?: string;
  containerClassName?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      id,
      children,
      value,
      defaultValue,
      disabled,
      name,
      onChange,
      onValueChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const listboxId = `${selectId}-listbox`;
    const rootRef = React.useRef<HTMLDivElement>(null);
    const selectRef = React.useRef<HTMLSelectElement | null>(null);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(
      defaultValue !== undefined ? String(defaultValue) : '',
    );
    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const options = React.Children.toArray(children).filter(
      (
        child,
      ): child is React.ReactElement<React.ComponentProps<'option'>> =>
        React.isValidElement(child) && child.type === 'option',
    );
    const selectedValue = isControlled ? String(value) : internalValue;
    const selectedIndex = Math.max(
      0,
      options.findIndex((option) => String(option.props.value) === selectedValue),
    );
    const selectedOption = options[selectedIndex];
    const selectedLabel = selectedOption?.props.children ?? '선택';

    React.useEffect(() => {
      if (!open) {
        return;
      }

      setActiveIndex(selectedIndex);
    }, [open, selectedIndex]);

    React.useEffect(() => {
      const handlePointerDown = (event: PointerEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener('pointerdown', handlePointerDown);

      return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    const setRefs = (node: HTMLSelectElement | null) => {
      selectRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      if (ref) {
        ref.current = node;
      }
    };

    const emitChange = (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      if (selectRef.current) {
        selectRef.current.value = nextValue;
      }

      onValueChange?.(nextValue);
      onChange?.({
        target: {
          value: nextValue,
          name,
        },
        currentTarget: {
          value: nextValue,
          name,
        },
      } as React.ChangeEvent<HTMLSelectElement>);
      setOpen(false);
    };

    const moveActive = (direction: 1 | -1) => {
      setActiveIndex((current) => {
        const enabledOptions = options.length;

        if (enabledOptions === 0) {
          return 0;
        }

        return (current + direction + enabledOptions) % enabledOptions;
      });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        moveActive(1);
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        moveActive(-1);
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }

        const option = options[activeIndex];
        if (option && !option.props.disabled) {
          emitChange(String(option.props.value));
        }
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    return (
      <div
        ref={rootRef}
        data-slot="select-field"
        className={cn('relative flex w-full flex-col gap-2', containerClassName)}
      >
        {label ? (
          <Typography
            as="label"
            variant="small"
            className="font-medium"
            htmlFor={selectId}
          >
            {label}
          </Typography>
        ) : null}
        <div className="relative">
          <select
            ref={setRefs}
            id={selectId}
            name={name}
            {...(isControlled
              ? { value: selectedValue }
              : { defaultValue: selectedValue })}
            disabled={disabled}
            aria-hidden
            tabIndex={-1}
            className="sr-only"
            onChange={onChange ?? (() => undefined)}
            onBlur={onBlur}
            {...props}
          >
            {children}
          </select>
          <button
            type="button"
            data-slot="select-trigger"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listboxId : undefined}
            disabled={disabled}
            onClick={() => setOpen((current) => !current)}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex h-[var(--input-height)] w-full items-center justify-between gap-3 rounded-[var(--radius-input)]',
              'border border-border bg-surface px-4',
              'text-body text-text-primary',
              'transition-colors duration-[var(--duration-fast)]',
              'outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error &&
                'border-danger focus-visible:border-danger focus-visible:ring-danger/30',
              className,
            )}
          >
            <span className="min-w-0 truncate text-left">{selectedLabel}</span>
            <ChevronDown
              aria-hidden
              className={cn(
                'size-4 shrink-0 text-text-secondary transition-transform',
                open && 'rotate-180',
              )}
            />
          </button>
          {open ? (
            <div
              id={listboxId}
              role="listbox"
              aria-labelledby={label ? selectId : undefined}
              data-slot="select-content"
              className={cn(
                'absolute z-50 mt-2 max-h-64 w-full overflow-y-auto',
                'rounded-[var(--radius-card)] border border-border bg-surface p-1 shadow-md',
              )}
            >
              {options.map((option, index) => {
                const optionValue = String(option.props.value);
                const selected = optionValue === selectedValue;
                const active = index === activeIndex;

                return (
                  <button
                    key={optionValue}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={option.props.disabled}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => emitChange(optionValue)}
                    className={cn(
                      'flex min-h-10 w-full items-center rounded-[var(--radius-button)] px-3 py-2 text-left text-[length:var(--text-small)]',
                      'transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                      selected
                        ? 'bg-primary/10 font-medium text-primary'
                        : active
                          ? 'bg-muted text-text-primary'
                          : 'text-text-primary hover:bg-muted',
                    )}
                  >
                    {option.props.children}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
        {error ? (
          <Typography variant="caption" className="text-danger">
            {error}
          </Typography>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select };

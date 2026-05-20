'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[transform,box-shadow,background-color,border-color,color] duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'border-foreground bg-foreground text-background shadow-[var(--shadow-paper-sm)] hover:-translate-y-px hover:shadow-[var(--shadow-paper)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
        outline:
          'border-foreground bg-background text-foreground shadow-[var(--shadow-paper-sm)] hover:-translate-y-px hover:bg-[color-mix(in_oklch,var(--marigold)_14%,var(--background))] hover:shadow-[var(--shadow-paper)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
        secondary:
          'border-border-strong bg-secondary text-secondary-foreground shadow-[var(--shadow-paper-sm)] hover:-translate-y-px hover:bg-accent active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
        ghost:
          'hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground active:translate-y-px',
        destructive:
          'border-foreground bg-[color-mix(in_oklch,var(--rust)_92%,var(--ink))] text-background shadow-[var(--shadow-paper-sm)] hover:-translate-y-px hover:shadow-[var(--shadow-paper)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
        link: 'text-foreground underline-offset-4 hover:underline decoration-[var(--marigold)] decoration-2',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  nativeButton,
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      nativeButton={nativeButton ?? (render ? false : true)}
      render={render}
      {...props}
    />
  )
}

export { Button, buttonVariants }

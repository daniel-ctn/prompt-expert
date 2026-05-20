import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'group/badge inline-flex h-[22px] w-fit shrink-0 items-center justify-center gap-1 rounded-sm border border-foreground/85 px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.18em] uppercase whitespace-nowrap transition-[transform,box-shadow,background-color] focus-visible:ring-2 focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default:
          'bg-foreground text-background shadow-[var(--shadow-paper-sm)]',
        secondary:
          'bg-[color-mix(in_oklch,var(--marigold)_28%,var(--background))] text-foreground shadow-[var(--shadow-paper-sm)]',
        destructive:
          'bg-[color-mix(in_oklch,var(--rust)_82%,var(--background))] text-background shadow-[var(--shadow-paper-sm)]',
        outline: 'bg-background text-foreground',
        ghost: 'border-transparent text-muted-foreground hover:text-foreground',
        link: 'border-transparent text-foreground underline-offset-4 hover:underline decoration-[var(--marigold)] decoration-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  })
}

export { Badge, badgeVariants }

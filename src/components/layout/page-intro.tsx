'use client'

import { FadeIn } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
  aside,
  align = 'start',
  compact = false,
  className,
}: {
  eyebrow?: string
  title: string
  description: string
  actions?: React.ReactNode
  aside?: React.ReactNode
  align?: 'start' | 'center'
  compact?: boolean
  className?: string
}) {
  const isCentered = align === 'center'

  return (
    <section
      className={cn(
        'page-frame relative overflow-hidden rounded-[calc(var(--radius-4xl)+2px)] px-5 py-6 sm:px-7',
        compact ? 'md:px-6 md:py-5' : 'md:px-8 md:py-7',
        className,
      )}
    >
      <div className="bg-primary/8 pointer-events-none absolute -top-20 right-12 h-44 w-44 rounded-full blur-3xl" />
      <div
        className={cn(
          'relative z-10 grid gap-6',
          aside && 'items-end md:grid-cols-[minmax(0,1fr)_auto]',
        )}
      >
        <div
          className={cn(
            'space-y-3',
            isCentered && 'mx-auto max-w-3xl text-center',
          )}
        >
          {eyebrow ? (
            <FadeIn delay={0.02}>
              <p className="page-eyebrow">{eyebrow}</p>
            </FadeIn>
          ) : null}
          <FadeIn delay={0.06}>
            <h1 className="page-title text-balance">{title}</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              className={cn(
                'page-copy text-pretty',
                isCentered && 'mx-auto max-w-2xl',
              )}
            >
              {description}
            </p>
          </FadeIn>
          {actions ? (
            <FadeIn delay={0.14}>
              <div
                className={cn(
                  'flex flex-wrap items-center gap-3 pt-1',
                  isCentered && 'justify-center',
                )}
              >
                {actions}
              </div>
            </FadeIn>
          ) : null}
        </div>
        {aside ? <FadeIn delay={0.12}>{aside}</FadeIn> : null}
      </div>
    </section>
  )
}

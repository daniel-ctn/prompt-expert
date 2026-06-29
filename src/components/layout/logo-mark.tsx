import { cn } from '@/lib/utils'

/**
 * Prompt Expert logo mark — the "Aperture P".
 *
 * A constructed geometric P whose counter is hollowed into a prompt-input
 * window, with a single electric-lime block cursor seated inside it: the
 * letterform and the workbench metaphor are the same shape. The mark is a
 * self-contained dark "instrument" tile (theme-independent, like the `.term`
 * panels) so the lime signal always sits on a dark surface.
 *
 * `animated` runs one calm cursor-settle on mount (see `.logo-cursor` /
 * `@keyframes logo-cursor-settle` in globals.css); it respects
 * `prefers-reduced-motion` and degrades to the solid static mark.
 */
export function LogoMark({
  className,
  animated = false,
}: {
  className?: string
  animated?: boolean
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Prompt Expert"
      className={className}
    >
      <rect width="64" height="64" rx="14" fill="#101216" />
      <rect
        x="0.6"
        y="0.6"
        width="62.8"
        height="62.8"
        rx="13.4"
        fill="none"
        stroke="#F2F4F5"
        strokeOpacity="0.07"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#F2F4F5"
        d="M17 14 Q17 13 18 13 L36 13 A12 12 0 0 1 36 37 L26 37 L26 48 Q26 49 25 49 L18 49 Q17 49 17 48 Z M26 20 L35 20 A5 5 0 0 1 35 30 L26 30 Z"
      />
      <rect
        className={cn(animated && 'logo-cursor')}
        x="29.5"
        y="22"
        width="5"
        height="6"
        rx="1.3"
        fill="var(--signal)"
      />
    </svg>
  )
}

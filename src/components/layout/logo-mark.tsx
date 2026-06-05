/**
 * Prompt Expert logo mark — a command-prompt caret with a marigold cursor block.
 *
 * Renders only the glyph (caret + cursor): the caret uses `currentColor` and the
 * cursor uses the marigold accent, so it adapts to whatever block it sits in
 * (ink-on-paper in light mode, paper-on-ink in dark mode). The surrounding
 * knockout block, border, and shadow are supplied by the wrapper.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <polyline
        points="18,18 35,32 18,46"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="40" y="23" width="7" height="18" fill="var(--marigold)" />
    </svg>
  )
}

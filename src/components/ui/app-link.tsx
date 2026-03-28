import Link from 'next/link'
import type { ComponentProps } from 'react'

export const appLinkTransitionTypes = {
  default: ['app-navigation'],
  builder: ['app-navigation', 'builder-entry'],
  back: ['app-navigation', 'navigation-back'],
  promptDetail: ['app-navigation', 'prompt-detail'],
  paginationNext: ['app-navigation', 'pagination', 'navigation-forward'],
  paginationPrevious: ['app-navigation', 'pagination', 'navigation-back'],
} as const

type AppLinkProps = Omit<ComponentProps<typeof Link>, 'transitionTypes'> & {
  transitionTypes?: readonly string[]
}

export function AppLink({
  transitionTypes = appLinkTransitionTypes.default,
  ...props
}: AppLinkProps) {
  return <Link {...props} transitionTypes={[...transitionTypes]} />
}

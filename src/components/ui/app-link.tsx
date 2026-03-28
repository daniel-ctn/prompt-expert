import Link from 'next/link'
import type { ComponentProps } from 'react'
import { appLinkTransitionTypes } from '@/components/ui/app-transition-types'

export { appLinkTransitionTypes } from '@/components/ui/app-transition-types'

type AppLinkProps = Omit<ComponentProps<typeof Link>, 'transitionTypes'> & {
  transitionTypes?: readonly string[]
}

export function AppLink({
  transitionTypes = appLinkTransitionTypes.default,
  ...props
}: AppLinkProps) {
  return <Link {...props} transitionTypes={[...transitionTypes]} />
}

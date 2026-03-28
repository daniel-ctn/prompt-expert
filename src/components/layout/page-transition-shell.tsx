'use client'

import { ViewTransition } from 'react'
import { usePathname } from 'next/navigation'
import { appTransitionType } from '@/components/ui/app-transition-types'

export function PageTransitionShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <ViewTransition
      key={pathname}
      default="none"
      enter={{
        [appTransitionType.builderEntry]: 'page-enter-builder',
        [appTransitionType.navigationForward]: 'page-enter-forward',
        [appTransitionType.navigationBack]: 'page-enter-back',
        [appTransitionType.promptDetail]: 'page-enter-detail',
        default: 'page-enter-fade',
      }}
      exit={{
        [appTransitionType.builderEntry]: 'page-exit-builder',
        [appTransitionType.navigationForward]: 'page-exit-forward',
        [appTransitionType.navigationBack]: 'page-exit-back',
        [appTransitionType.promptDetail]: 'page-exit-detail',
        default: 'page-exit-fade',
      }}
      update={{
        [appTransitionType.navigationForward]: 'page-update-forward',
        [appTransitionType.navigationBack]: 'page-update-back',
        default: 'page-update-fade',
      }}
    >
      <main className="flex-1">{children}</main>
    </ViewTransition>
  )
}

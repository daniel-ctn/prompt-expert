'use client'

import { Fragment, ViewTransition } from 'react'

type ViewTransitionProps = React.ComponentProps<typeof ViewTransition>

export function AppViewTransition(props: ViewTransitionProps) {
  if (typeof ViewTransition !== 'function') {
    return <Fragment>{props.children}</Fragment>
  }

  return <ViewTransition {...props} />
}

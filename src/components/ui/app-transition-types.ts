export const appTransitionType = {
  appNavigation: 'app-navigation',
  builderEntry: 'builder-entry',
  navigationBack: 'navigation-back',
  navigationForward: 'navigation-forward',
  pagination: 'pagination',
  promptDetail: 'prompt-detail',
} as const

export const appLinkTransitionTypes = {
  default: [appTransitionType.appNavigation],
  builder: [appTransitionType.appNavigation, appTransitionType.builderEntry],
  back: [appTransitionType.appNavigation, appTransitionType.navigationBack],
  promptDetail: [
    appTransitionType.appNavigation,
    appTransitionType.promptDetail,
  ],
  paginationNext: [
    appTransitionType.appNavigation,
    appTransitionType.pagination,
    appTransitionType.navigationForward,
  ],
  paginationPrevious: [
    appTransitionType.appNavigation,
    appTransitionType.pagination,
    appTransitionType.navigationBack,
  ],
} as const

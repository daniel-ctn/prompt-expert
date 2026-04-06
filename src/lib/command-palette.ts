const COMMAND_PALETTE_EVENT = 'command-palette:toggle'

export function setCommandPaletteOpen(open?: boolean) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent(COMMAND_PALETTE_EVENT, {
      detail: { open },
    }),
  )
}

export { COMMAND_PALETTE_EVENT }

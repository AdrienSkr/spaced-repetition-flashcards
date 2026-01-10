import { Page } from '../../main'
import DeckSelector from './Selector/DeckSelector'

type Props = {
  currentPage: Page // Kept for API compatibility
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TopBar({ currentPage }: Props) {
  return (
    <nav
      id="navbar"
      class="glass fixed top-0 z-50 flex h-14 w-full items-center justify-center border-b border-primary-100 bg-white/80 px-4"
    >
      <DeckSelector />
    </nav>
  )
}

import { Page } from '../../main'
import DeckSelector from './Selector/DeckSelector'

type Props = {
  currentPage: Page
}

export function TopBar({ currentPage: _currentPage }: Props) {
  return (
    <nav
      id="navbar"
      class="glass fixed top-0 z-50 flex h-14 w-full items-center justify-center border-b border-neutral-200 px-4"
    >
      <DeckSelector />
    </nav>
  )
}

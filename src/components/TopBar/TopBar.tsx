import { Page } from '../../main'
import CollectionSelector from './Selector/Collection/CollectionSelector'
import LearningSelector from './Selector/Learning/LearningSelector'

type Props = {
  currentPage: Page
}

export function TopBar({ currentPage }: Props) {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'learning':
        return null // Show selector instead
      case 'collection':
        return null // Show selector instead
      case 'progress':
        return 'Progress'
      case 'edition':
        return 'Edit Card'
      default:
        return null
    }
  }

  const title = getPageTitle()

  return (
    <nav
      id="navbar"
      class="glass fixed top-0 z-50 flex h-14 w-full items-center justify-center border-b border-primary-100 bg-white/80 px-4"
    >
      {currentPage === 'learning' && <LearningSelector />}
      {currentPage === 'collection' && <CollectionSelector />}
      {title && <h1 class="text-lg font-semibold text-gray-900">{title}</h1>}
    </nav>
  )
}

import CollectionIcon from '../../assets/collection.svg'
import LearnIcon from '../../assets/learn.svg'
import ProgressIcon from '../../assets/progress.svg'
import { Page } from '../../main'

type Props = {
  currentPage: Page
  setCurrentPage: (page: Page) => void
}

type NavItemProps = {
  icon: string
  label: string
  page: Page
  isActive: boolean
  onClick: (page: Page) => void
}

function NavItem({ icon, label, page, isActive, onClick }: NavItemProps) {
  return (
    <div
      className={`nav-item group ${isActive ? 'nav-item-active' : ''}`}
      onClick={() => onClick(page)}
    >
      <div className={`nav-icon ${isActive ? 'nav-icon-active' : ''}`}>
        <img
          src={icon}
          alt={label}
          className="size-full transition-all duration-fast group-hover:scale-110"
        />
      </div>
      <span className={`text-xs transition-all duration-fast ${
        isActive 
          ? 'font-medium text-brand-700' 
          : 'font-normal text-neutral-500 group-hover:text-brand-600'
      }`}>
        {label}
      </span>
    </div>
  )
}

export function BottomBar({ currentPage, setCurrentPage }: Props) {
  return (
    <div className="glass fixed inset-x-0 bottom-0 z-40 flex h-20 w-full items-center justify-center border-t border-neutral-200 shadow-md">
      <div className="flex gap-16">
        <NavItem 
          icon={LearnIcon} 
          label="Learning" 
          page="learning" 
          isActive={currentPage === 'learning'}
          onClick={setCurrentPage}
        />
        <NavItem 
          icon={CollectionIcon} 
          label="Collection" 
          page="collection" 
          isActive={currentPage === 'collection'}
          onClick={setCurrentPage}
        />
        <NavItem 
          icon={ProgressIcon} 
          label="Progress" 
          page="progress" 
          isActive={currentPage === 'progress'}
          onClick={setCurrentPage}
        />
      </div>
    </div>
  )
}

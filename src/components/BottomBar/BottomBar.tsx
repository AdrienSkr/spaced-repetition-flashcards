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
    <button
      type="button"
      className={`nav-item group ${isActive ? 'nav-item-active' : ''}`}
      onClick={() => onClick(page)}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`nav-icon ${isActive ? 'nav-icon-active' : ''}`}>
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className="size-full transition-all duration-fast group-hover:scale-110"
        />
      </div>
      {/* Container avec pseudo-élément invisible pour réserver l'espace du texte gras */}
      <span className="relative inline-flex flex-col items-center">
        <span
          className={`text-xs transition-all duration-fast ${
            isActive
              ? 'font-medium text-brand-700'
              : 'font-normal text-neutral-500 group-hover:text-brand-600'
          }`}
        >
          {label}
        </span>
        {/* Texte invisible en gras pour réserver l'espace et éviter le décalage */}
        <span className="invisible h-0 text-xs font-medium" aria-hidden="true">
          {label}
        </span>
      </span>
    </button>
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

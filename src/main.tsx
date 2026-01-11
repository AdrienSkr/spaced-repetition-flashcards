import { render } from 'preact'
import { useState } from 'preact/hooks'
import { BottomBar } from './components/BottomBar/BottomBar'
import { DevToolbarWrapper } from './components/Dev/DevToolbarWrapper'
import { ListSelectorProvider } from './contexts/ListSelectorContext'
import { CollectionPage } from './components/Page/Collection/CollectionPage'
import { LearningProvider } from './components/Page/Learning/LearningContext'
import { LearningPage } from './components/Page/Learning/LearningPage'
import { ProgressPage } from './components/Page/Progress/ProgressPage'
import { TopBar } from './components/TopBar/TopBar'
import './style.css'

export type Page = 'learning' | 'collection' | 'progress'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('learning')

  const renderPage = () => {
    switch (currentPage) {
      case 'learning':
        return <LearningPage />
      case 'collection':
        return <CollectionPage />
      case 'progress':
        return <ProgressPage />
    }
  }

  return (
    <ListSelectorProvider>
      <LearningProvider>
        <div className="flex min-h-screen flex-col bg-surface-bg">
          {/* Skip link pour l'accessibilité clavier */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100000] focus:rounded-md focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            Aller au contenu principal
          </a>
          <TopBar currentPage={currentPage} />
          <main
            id="main-content"
            className="flex grow flex-col items-center justify-center px-4 pb-24 pt-14"
            tabIndex={-1}
          >
            <div className="w-full max-w-5xl">{renderPage()}</div>
          </main>
          <BottomBar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          {/* DevToolbarWrapper utilise un import conditionnel */}
          {/* Vite éliminera le code mort en production grâce au remplacement de import.meta.env.DEV par false */}
          {/* Rollup effectuera le dead code elimination sur tout le code du DevToolbar */}
          <DevToolbarWrapper />
        </div>
      </LearningProvider>
    </ListSelectorProvider>
  )
}

const appContainer = document.getElementById('root')
if (appContainer) {
  render(<App />, appContainer)
}

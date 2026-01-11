import { FunctionComponent } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { useListSelector } from '../../../contexts/ListSelectorContext'
import { Modal } from '../../shared/Modal'
import { CreateListModalContent } from '../../Modals/CreateListModal'
import { DeckSettingsModalContent } from '../../Modals/DeckSettingsModal'
import { List } from '../../../models/List'
import { db } from '../../../models/db'

const DeckSelector: FunctionComponent = () => {
  const { selectedListId, setSelectedListId, lists, setLists } = useListSelector()
  const [showCreateListModal, setShowCreateListModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [settingsList, setSettingsList] = useState<List | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined)
  const isMountedRef = useRef(true)
  const selectorIdRef = useRef(`deck-selector-${Math.random().toString(36).slice(2, 11)}`)

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current && isMountedRef.current) {
      requestAnimationFrame(() => {
        if (buttonRef.current && isMountedRef.current) {
          setDropdownWidth(buttonRef.current.offsetWidth)
        }
      })
    } else if (!isDropdownOpen) {
      setDropdownWidth(undefined)
    }
  }, [isDropdownOpen])

  useEffect(() => {
    if (!isDropdownOpen || !isMountedRef.current) return
    const dropdownElement = dropdownRef.current
    if (!dropdownElement) return

    const handleClickOutside = (event: MouseEvent) => {
      if (isMountedRef.current && dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (isMountedRef.current && event.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true)
      document.addEventListener('keydown', handleEscape, true)
    }, 10)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('keydown', handleEscape, true)
    }
  }, [isDropdownOpen])

  const handleListSelect = useCallback((listId: number) => {
    if (!isMountedRef.current) return
    setSelectedListId(listId)
    setIsDropdownOpen(false)
  }, [setSelectedListId])

  const handleSettingsClick = useCallback((e: Event, list: List) => {
    e.stopPropagation()
    e.preventDefault()
    if (!isMountedRef.current) return
    setSettingsList(list)
    setShowSettingsModal(true)
    setIsDropdownOpen(false)
  }, [])

  const handleCreateListClick = useCallback((e: Event) => {
    e.stopPropagation()
    e.preventDefault()
    if (!isMountedRef.current) return
    setShowCreateListModal(true)
    setIsDropdownOpen(false)
  }, [])

  const handleCreateListSuccess = useCallback(async (listId: number) => {
    if (!isMountedRef.current) return
    const newList = await db.lists.get(listId)
    if (newList && isMountedRef.current) {
      setLists([...lists, newList])
      setSelectedListId(newList.id!)
    }
    setShowCreateListModal(false)
  }, [lists, setLists, setSelectedListId])

  const handleSettingsSuccess = useCallback((updatedList: List) => {
    if (!isMountedRef.current) return
    setLists(lists.map(l => l.id === updatedList.id ? updatedList : l))
    setSelectedListId(updatedList.id!)
    setShowSettingsModal(false)
    setSettingsList(null)
  }, [lists, setLists, setSelectedListId])

  const currentListTitle = selectedListId === 0
    ? 'All Cards'
    : lists.find(l => l.id === selectedListId)?.title || 'All Cards'

  return (
    <>
      <div class="relative" ref={dropdownRef} id={selectorIdRef.current} data-selector="deck">
        {/* Dropdown Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            if (isMountedRef.current) {
              setIsDropdownOpen((prev) => !prev)
            }
          }}
          class="flex min-w-[200px] items-center justify-between gap-2 rounded-lg border-2 border-neutral-200 bg-white px-4 py-1.5 font-medium text-neutral-700 transition-all duration-fast hover:border-brand-300 hover:shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <span class="truncate">{currentListTitle}</span>
          <svg
            class={`size-4 shrink-0 transition-transform duration-fast ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div 
            data-dropdown-menu="deck"
            class="absolute left-0 top-full z-[100] mt-2 min-w-[200px] rounded-lg border border-neutral-200 bg-white shadow-lg"
            style={{ width: dropdownWidth ? `${dropdownWidth}px` : '100%' }}
          >
            {/* All Cards Option */}
            <button
              onClick={() => handleListSelect(0)}
              class={`w-full px-4 py-2 text-left font-medium transition-colors duration-fast hover:bg-brand-50 ${
                selectedListId === 0 ? 'bg-brand-100 text-brand-700' : 'text-neutral-700'
              }`}
            >
              All Cards
            </button>

            {lists.length > 0 && <div class="border-t border-neutral-100" />}

            {/* List of decks */}
            <div class="max-h-60 overflow-y-auto">
              {lists.map((list) => (
                <div
                  key={list.id}
                  class={`flex items-center justify-between px-4 py-2 transition-colors duration-fast hover:bg-brand-50 ${
                    selectedListId === list.id ? 'bg-brand-100' : ''
                  }`}
                >
                  <button
                    onClick={() => handleListSelect(list.id!)}
                    class="flex-1 text-left font-medium text-neutral-700 hover:text-brand-600"
                  >
                    {list.title}
                  </button>
                  <button
                    onClick={(e) => handleSettingsClick(e, list)}
                    class="ml-2 rounded-md p-1 text-neutral-400 transition-colors duration-fast hover:bg-neutral-100 hover:text-brand-600"
                    title="Deck Settings"
                  >
                    <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {(lists.length > 0 || selectedListId === 0) && <div class="border-t border-neutral-100" />}

            {/* Create New Deck Button */}
            <button
              onClick={handleCreateListClick}
              class="flex w-full items-center justify-center gap-2 px-4 py-3 text-brand-600 transition-colors duration-fast hover:bg-brand-50"
            >
              <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="font-medium">Create New Deck</span>
            </button>
          </div>
        )}
      </div>

      {/* Create List Modal */}
      <Modal isOpen={showCreateListModal} onClose={() => setShowCreateListModal(false)} title="Create New Deck" size="md">
        <CreateListModalContent onSuccess={handleCreateListSuccess} onCancel={() => setShowCreateListModal(false)} />
      </Modal>

      {/* Deck Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => { setShowSettingsModal(false); setSettingsList(null) }}
        title="Deck Settings"
        size="md"
      >
        {settingsList && (
          <DeckSettingsModalContent
            list={settingsList}
            onSuccess={handleSettingsSuccess}
            onCancel={() => { setShowSettingsModal(false); setSettingsList(null) }}
          />
        )}
      </Modal>
    </>
  )
}

export default DeckSelector

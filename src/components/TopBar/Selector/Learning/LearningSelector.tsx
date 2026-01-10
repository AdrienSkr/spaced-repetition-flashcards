// components/LearningSelector.tsx
import { FunctionComponent } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { useLearningContext } from '../../../Page/Learning/LearningContext'
import { Modal } from '../../../shared/Modal'
import { DeckSettingsModalContent } from '../../../Modals/DeckSettingsModal'
import { CreateListModalContent } from '../../../Modals/CreateListModal'
import { List } from '../../../../models/List'
import { db } from '../../../../models/db'

const LearningSelector: FunctionComponent = () => {
  const { selectedList, setSelectedList, lists, setLists } =
    useLearningContext()
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showCreateListModal, setShowCreateListModal] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [settingsList, setSettingsList] = useState<List | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(
    undefined,
  )
  const isMountedRef = useRef(true)
  const selectorIdRef = useRef(
    `learning-selector-${Math.random().toString(36).slice(2, 11)}`,
  )

  // Track if component is mounted to prevent state updates after unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Update dropdown width when opening to match button width
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current && isMountedRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (buttonRef.current && isMountedRef.current) {
          const buttonWidth = buttonRef.current.offsetWidth
          setDropdownWidth(buttonWidth)
        }
      })
    } else if (!isDropdownOpen) {
      // Reset width when closed
      setDropdownWidth(undefined)
    }
  }, [isDropdownOpen])

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isDropdownOpen || !isMountedRef.current) return

    const dropdownElement = dropdownRef.current
    if (!dropdownElement) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMountedRef.current &&
        dropdownElement &&
        !dropdownElement.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (isMountedRef.current && event.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }

    // Use a small timeout to avoid immediate closure when opening
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

  const handleListSelect = useCallback(
    (list: List) => {
      if (!isMountedRef.current) return
      setSelectedList(list)
      setIsDropdownOpen(false)
    },
    [setSelectedList],
  )

  const handleSettingsClick = useCallback((e: Event, list: List) => {
    e.stopPropagation()
    e.preventDefault()
    if (!isMountedRef.current) return
    setSettingsList(list)
    setShowSettingsModal(true)
    setIsDropdownOpen(false)
  }, [])

  const handleSettingsSuccess = useCallback(
    (updatedList: List) => {
      if (!isMountedRef.current) return
      // Update lists array with the modified list
      setLists(lists.map((l) => (l.id === updatedList.id ? updatedList : l)))
      setSelectedList(updatedList)
      setShowSettingsModal(false)
      setSettingsList(null)
    },
    [lists, setLists, setSelectedList],
  )

  const handleCreateListClick = useCallback((e: Event) => {
    e.stopPropagation()
    e.preventDefault()
    if (!isMountedRef.current) return
    setShowCreateListModal(true)
    setIsDropdownOpen(false)
  }, [])

  const handleCreateListSuccess = useCallback(
    async (listId: number) => {
      if (!isMountedRef.current) return
      // Fetch the newly created list from database
      const newList = await db.lists.get(listId)
      if (newList && isMountedRef.current) {
        // Update lists array and select the new list
        setLists([...lists, newList])
        setSelectedList(newList)
      }
      setShowCreateListModal(false)
    },
    [lists, setLists, setSelectedList],
  )

  // Get current selected list for display (fallback to first list if none selected)
  const currentList =
    selectedList?.id !== undefined
      ? selectedList
      : lists.length > 0
      ? lists[0]
      : null

  return (
    <>
      <div
        class="relative"
        ref={dropdownRef}
        id={selectorIdRef.current}
        data-selector="learning"
      >
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
          class="flex min-w-[200px] items-center justify-between gap-2 rounded-2xl border-2 border-primary-200 bg-white px-5 py-1.5 font-medium text-gray-700 transition-all duration-200 hover:border-primary-300 hover:shadow-soft focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <span class="truncate">{currentList?.title || 'Select a deck'}</span>
          <svg
            class={`size-4 shrink-0 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            data-dropdown-menu="learning"
            class="absolute left-0 top-full z-[100] mt-2 min-w-[200px] rounded-xl border-2 border-primary-200 bg-white shadow-xl"
            style={{ width: dropdownWidth ? `${dropdownWidth}px` : '100%' }}
          >
            {/* List of decks */}
            <div class="max-h-60 overflow-y-auto">
              {lists.map((list) => (
                <div
                  key={list.id}
                  class={`flex items-center justify-between px-4 py-2 transition-colors hover:bg-primary-50 ${
                    selectedList?.id === list.id ? 'bg-primary-100' : ''
                  }`}
                >
                  <button
                    onClick={() => handleListSelect(list)}
                    class="flex-1 text-left font-medium text-gray-700 hover:text-primary-600"
                  >
                    {list.title}
                  </button>
                  <button
                    onClick={(e) => handleSettingsClick(e, list)}
                    class="ml-2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary-600"
                    title="Deck Settings"
                  >
                    <svg
                      class="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Divider */}
            {lists.length > 0 && <div class="border-t border-primary-100" />}

            {/* Create New Deck Button */}
            <button
              onClick={handleCreateListClick}
              class="flex w-full items-center justify-center gap-2 px-4 py-3 text-primary-600 transition-colors hover:bg-primary-50"
            >
              <svg
                class="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span class="font-medium">Create New Deck</span>
            </button>
          </div>
        )}
      </div>

      {/* Create List Modal */}
      <Modal
        isOpen={showCreateListModal}
        onClose={() => setShowCreateListModal(false)}
        title="Create New Deck"
        size="md"
      >
        <CreateListModalContent
          onSuccess={handleCreateListSuccess}
          onCancel={() => setShowCreateListModal(false)}
        />
      </Modal>

      {/* Deck Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false)
          setSettingsList(null)
        }}
        title="Deck Settings"
        size="md"
      >
        {settingsList && (
          <DeckSettingsModalContent
            list={settingsList}
            onSuccess={handleSettingsSuccess}
            onCancel={() => {
              setShowSettingsModal(false)
              setSettingsList(null)
            }}
          />
        )}
      </Modal>
    </>
  )
}

export default LearningSelector

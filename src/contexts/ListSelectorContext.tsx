import { createContext, FunctionComponent } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { List } from '../models/List'

const SELECTED_LIST_KEY = 'pairwise_selected_list'

interface ListSelectorContextType {
  selectedListId: number // 0 = All Cards
  setSelectedListId: (id: number) => void
  lists: List[]
  setLists: (lists: List[]) => void
  selectedList: List | null // Helper: returns the List object if selectedListId > 0, null if 0
}

export const ListSelectorContext = createContext<
  ListSelectorContextType | undefined
>(undefined)

export const ListSelectorProvider: FunctionComponent = ({ children }) => {
  // Initialize selectedListId from localStorage, default to 0 (All Cards)
  const [selectedListId, setSelectedListIdState] = useState<number>(() => {
    const savedId = localStorage.getItem(SELECTED_LIST_KEY)
    if (savedId !== null) {
      const id = parseInt(savedId, 10)
      if (!isNaN(id) && id >= 0) {
        return id
      }
    }
    return 0 // Default to "All Cards"
  })

  const [lists, setLists] = useState<List[]>([])

  // Save selectedListId to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(SELECTED_LIST_KEY, selectedListId.toString())
  }, [selectedListId])

  // Wrapper function to update state
  const setSelectedListId = (id: number) => {
    if (id >= 0) {
      setSelectedListIdState(id)
    }
  }

  // Helper: get the selected List object (null if All Cards)
  const selectedList =
    selectedListId === 0
      ? null
      : lists.find((list) => list.id === selectedListId) || null

  return (
    <ListSelectorContext.Provider
      value={{
        selectedListId,
        setSelectedListId,
        lists,
        setLists,
        selectedList,
      }}
    >
      {children}
    </ListSelectorContext.Provider>
  )
}

export const useListSelector = () => {
  const context = useContext(ListSelectorContext)
  if (context === undefined) {
    throw new Error(
      'useListSelector must be used within a ListSelectorProvider',
    )
  }
  return context
}

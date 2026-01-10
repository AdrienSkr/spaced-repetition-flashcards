import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect } from 'preact/hooks'
import { db } from '../../../models/db'
import { useListSelector } from '../../../contexts/ListSelectorContext'
import { CardsView } from './CardsView'

export function CollectionPage() {
  const lists = useLiveQuery(() => db.lists.toArray())
  const { selectedListId, setLists } = useListSelector()

  useEffect(() => {
    if (lists) {
      setLists(lists)
    }
  }, [lists, setLists])

  if (!lists) return null

  // Use selectedListId: 0 = All Cards, otherwise use the selected list
  const listToShow = selectedListId === 0
    ? { id: 0, title: 'all' }
    : lists.find(l => l.id === selectedListId) || { id: 0, title: 'all' }

  return (
    <div>
      <CardsView list={listToShow} />
    </div>
  )
}

import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'preact/hooks'
import { db } from '../../../models/db'
import { useListSelector } from '../../../contexts/ListSelectorContext'
import { Modal } from '../../shared/Modal'
import { CreateListModalContent } from '../../Modals/CreateListModal'
import { AddCardModalContent } from '../../Modals/AddCardModal'
import { EmptyState } from '../../Onboarding/EmptyState'
import { ListView } from './ListView'

export function LearningPage() {
  const lists = useLiveQuery(() => db.lists.toArray())
  const { selectedListId, setLists } = useListSelector()
  
  // Modal states
  const [showCreateListModal, setShowCreateListModal] = useState(false)
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [newListId, setNewListId] = useState<number | null>(null)

  useEffect(() => {
    if (lists) {
      setLists(lists)
    }
  }, [lists, setLists])

  // Loading state
  if (lists === undefined) {
    return (
      <div class="flex min-h-[60vh] items-center justify-center">
        <div class="animate-pulse text-brand-500">Loading...</div>
      </div>
    )
  }

  // Empty state - show onboarding
  if (lists.length === 0) {
    return (
      <>
        <EmptyState onCreateList={() => setShowCreateListModal(true)} />
        
        {/* Create List Modal */}
        <Modal
          isOpen={showCreateListModal}
          onClose={() => setShowCreateListModal(false)}
          title="Create Your First Deck"
        >
          <CreateListModalContent
            onSuccess={(listId) => {
              setNewListId(listId)
              setShowCreateListModal(false)
              setShowAddCardModal(true)
            }}
            onCancel={() => setShowCreateListModal(false)}
          />
        </Modal>

        {/* Add Card Modal */}
        <Modal
          isOpen={showAddCardModal}
          onClose={() => setShowAddCardModal(false)}
          title="Add Your First Card"
          size="lg"
        >
          {newListId && (
            <AddCardModalContent
              listId={newListId}
              onSuccess={() => setShowAddCardModal(false)}
              onCancel={() => setShowAddCardModal(false)}
            />
          )}
        </Modal>
      </>
    )
  }

  const handleAddCard = (listId: number) => {
    setNewListId(listId)
    setShowAddCardModal(true)
  }

  // Determine which list to show: selectedListId === 0 means "All Cards"
  const listToShow = selectedListId === 0
    ? { id: 0, title: 'all cards' }
    : lists.find(l => l.id === selectedListId) || { id: 0, title: 'all cards' }

  return (
    <>
      <div class="animate-fade-in">
        <ListView 
          list={listToShow} 
          onAddCard={listToShow.id !== 0 ? () => handleAddCard(listToShow.id!) : undefined} 
        />
      </div>

      {/* Add Card Modal */}
      <Modal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        title="Add Card"
        size="lg"
      >
        {newListId && (
          <AddCardModalContent
            listId={newListId}
            onSuccess={() => setShowAddCardModal(false)}
            onCancel={() => setShowAddCardModal(false)}
          />
        )}
      </Modal>
    </>
  )
}

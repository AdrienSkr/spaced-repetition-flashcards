import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'preact/hooks'
import { db } from '../../../models/db'
import { useListSelector } from '../../../contexts/ListSelectorContext'
import { CardsView } from './CardsView'
import { Icon } from '../../shared/Icon'
import { Modal } from '../../shared/Modal'
import { AddCardModalContent } from '../../Modals/AddCardModal'
import { DeckSettingsModalContent } from '../../Modals/DeckSettingsModal'
import { DeleteConfirmModalContent } from '../../Modals/DeleteConfirmModal'
import { ImportCardsModalContent } from '../../Modals/ImportCardsModal'
import { isDue } from '../../../utils/sm2'
import { List } from '../../../models/List'

export function CollectionPage() {
  const lists = useLiveQuery(() => db.lists.toArray())
  const { selectedListId, setLists, setSelectedListId } = useListSelector()
  
  // Modal states
  const [showAddCard, setShowAddCard] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showDeleteDeck, setShowDeleteDeck] = useState(false)
  const [showImport, setShowImport] = useState(false)

  // Get cards count for the selected list
  const cards = useLiveQuery(
    () => selectedListId === 0
      ? db.cards.toArray()
      : db.cards.where({ listId: selectedListId }).toArray(),
    [selectedListId]
  )

  useEffect(() => {
    if (lists) {
      setLists(lists)
    }
  }, [lists, setLists])

  if (!lists) return null

  // Use selectedListId: 0 = All Cards, otherwise use the selected list
  const listToShow: List = selectedListId === 0
    ? { id: 0, title: 'all' }
    : lists.find(l => l.id === selectedListId) || { id: 0, title: 'all' }

  const isSpecificList = selectedListId !== 0 && listToShow.id !== 0
  const cardCount = cards?.length || 0
  const dueCount = cards?.filter(c => isDue(c.nextReview || 0)).length || 0

  const handleDeleteDeck = async () => {
    if (selectedListId && selectedListId !== 0) {
      // Delete all cards in the deck
      await db.cards.where({ listId: selectedListId }).delete()
      // Delete the deck itself
      await db.lists.delete(selectedListId)
      // Navigate to "All Cards"
      setSelectedListId(0)
      setShowDeleteDeck(false)
    }
  }

  const handleImportSuccess = (count: number) => {
    setShowImport(false)
    console.log(`${count} card(s) imported successfully`)
  }

  return (
    <div class="animate-fade-in space-y-6 pt-4">
      {/* Header with actions */}
      {isSpecificList && (
        <div class="flex flex-wrap items-center justify-between gap-4">
          {/* Stats */}
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <div class="icon-container-md rounded-lg bg-brand-100">
                <Icon name="folder" size={20} color="#0ea5e9" />
              </div>
              <div>
                <p class="text-sm text-neutral-500">Cards</p>
                <p class="text-lg font-semibold text-neutral-900">{cardCount}</p>
              </div>
            </div>
            {dueCount > 0 && (
              <div class="flex items-center gap-2">
                <div class="icon-container-md rounded-lg bg-warning-light">
                  <Icon name="clock" size={20} color="#b45309" />
                </div>
                <div>
                  <p class="text-sm text-neutral-500">Due</p>
                  <p class="text-lg font-semibold text-warning-dark">{dueCount}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div class="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddCard(true)}
              class="btn-primary"
            >
              <Icon name="plus" size={18} />
              <span>Add</span>
            </button>
            <button
              onClick={() => setShowImport(true)}
              class="btn-secondary"
            >
              <Icon name="import" size={18} />
              <span>Import</span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              class="btn-ghost"
            >
              <Icon name="settings" size={18} />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setShowDeleteDeck(true)}
              class="btn-danger"
            >
              <Icon name="trash" size={18} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Cards View */}
      <CardsView list={listToShow} onAddCard={() => setShowAddCard(true)} />

      {/* Add Card Modal */}
      <Modal
        isOpen={showAddCard}
        onClose={() => setShowAddCard(false)}
        title="Add Card"
      >
        <AddCardModalContent
          listId={selectedListId}
          onSuccess={() => setShowAddCard(false)}
          onCancel={() => setShowAddCard(false)}
        />
      </Modal>

      {/* Deck Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Deck Settings"
      >
        <DeckSettingsModalContent
          list={listToShow}
          onSuccess={() => setShowSettings(false)}
          onCancel={() => setShowSettings(false)}
        />
      </Modal>

      {/* Delete Deck Modal */}
      <Modal
        isOpen={showDeleteDeck}
        onClose={() => setShowDeleteDeck(false)}
        title="Delete Deck"
        size="sm"
      >
        <DeleteConfirmModalContent
          title="Delete this deck?"
          message={`The deck "${listToShow.title}" and all its ${cardCount} card${cardCount > 1 ? 's' : ''} will be permanently deleted.`}
          confirmLabel="Delete Deck"
          onConfirm={handleDeleteDeck}
          onCancel={() => setShowDeleteDeck(false)}
        />
      </Modal>

      {/* Import Cards Modal */}
      <Modal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        title="Import Cards"
        size="lg"
      >
        <ImportCardsModalContent
          listId={selectedListId}
          onSuccess={handleImportSuccess}
          onCancel={() => setShowImport(false)}
        />
      </Modal>
    </div>
  )
}

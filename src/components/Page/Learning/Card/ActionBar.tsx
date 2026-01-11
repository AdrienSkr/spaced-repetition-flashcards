import AddIcon from '../../../../assets/add.svg'
import EditIcon from '../../../../assets/edit.svg'
import FillingIcon from '../../../../assets/filling.svg'
import SwippingIcon from '../../../../assets/swipping.svg'
import TypingIcon from '../../../../assets/typing.svg'
import { Card } from '../../../../models/Card'
import { useLearningContext } from '../LearningContext'

interface ActionBarProps {
  card?: Card
  listId?: number
  onAddCard?: () => void
  onEditCard?: (card: Card) => void
}

export const ActionBar = ({ card, listId, onAddCard, onEditCard }: ActionBarProps) => {
  const { learningMode, setLearningMode } = useLearningContext()

  const handleEdit = () => {
    if (card && onEditCard) {
      onEditCard(card)
    }
  }

  const handleAdd = () => {
    if (onAddCard) {
      onAddCard()
    }
  }

  const ActionButton = ({ 
    icon, 
    label, 
    onClick,
    disabled = false,
    isActive = false
  }: { 
    icon: string
    label: string
    onClick?: () => void
    disabled?: boolean
    isActive?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isActive}
      aria-label={label}
      class={`group relative flex size-7 items-center justify-center rounded-md p-1 
             transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-brand-400
             ${disabled 
               ? 'cursor-not-allowed opacity-40' 
               : isActive
                 ? 'cursor-pointer bg-brand-200 shadow-sm ring-2 ring-brand-400'
                 : 'cursor-pointer hover:bg-brand-100 hover:shadow-sm active:bg-brand-200'
             }`}
    >
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        class={`size-full transition-transform duration-fast ${!disabled && 'group-hover:scale-110'}`}
      />
      <span 
        class="pointer-events-none absolute -bottom-8 left-1/2 z-10 
               -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800 px-2 py-1 
               text-xs text-white opacity-0 
               transition-opacity duration-fast group-hover:opacity-100"
        role="tooltip"
      >
        {label}
      </span>
    </button>
  )

  return (
    <div
      id="bar"
      class="absolute left-1/2 top-4 flex h-10 -translate-x-1/2 
             items-center justify-between gap-6 
             rounded-lg border border-brand-100 
             bg-brand-50 px-4 shadow-sm"
    >
      {/* Learning Mode Buttons */}
      <div class="flex items-center gap-2">
        <ActionButton 
          icon={TypingIcon} 
          label="Typing" 
          onClick={() => setLearningMode('typing')}
          isActive={learningMode === 'typing'}
        />
        <ActionButton 
          icon={SwippingIcon} 
          label="Swipe" 
          onClick={() => setLearningMode('swipe')}
          isActive={learningMode === 'swipe'}
        />
        <ActionButton 
          icon={FillingIcon} 
          label="Fill-in" 
          onClick={() => setLearningMode('fillIn')}
          isActive={learningMode === 'fillIn'}
        />
      </div>

      {/* Divider */}
      <div class="h-5 w-px bg-brand-200" />

      {/* Edit Actions */}
      <div class="flex items-center gap-2">
        <ActionButton 
          icon={EditIcon} 
          label="Edit" 
          onClick={handleEdit}
          disabled={!card}
        />
        <ActionButton 
          icon={AddIcon} 
          label="Add" 
          onClick={handleAdd}
          disabled={!listId}
        />
      </div>
    </div>
  )
}

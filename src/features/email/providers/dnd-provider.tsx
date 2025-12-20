import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  MeasuringStrategy,
  type UniqueIdentifier,
  type CollisionDetection,
  pointerWithin,
} from '@dnd-kit/core'
import { createContext, useContext, useState, type PropsWithChildren } from 'react'

// ============================================
// TYPES
// ============================================

interface DndContextValue {
  activeId: UniqueIdentifier | null
  isDragging: boolean
}

interface DndProviderProps extends PropsWithChildren {
  onDragEnd: (activeId: string, overId: string) => void
  renderOverlay?: (activeId: string) => React.ReactNode
}

// ============================================
// CONTEXT
// ============================================

const DndStateContext = createContext<DndContextValue | null>(null)

export const useDndState = () => {
  const context = useContext(DndStateContext)
  if (!context) {
    throw new Error('useDndState must be used within DndProvider')
  }
  return context
}

// ============================================
// CUSTOM COLLISION DETECTION
// ============================================

const createSiblingOnlyCollision = (): CollisionDetection => {
  return (args) => {
    const { active, droppableContainers } = args

    const activeParentId = active.data.current?.sortable?.containerId

    const siblingContainers = droppableContainers.filter((container) => {
      const containerParentId = container.data.current?.sortable?.containerId
      return containerParentId === activeParentId
    })

    const pointerCollisions = pointerWithin({
      ...args,
      droppableContainers: siblingContainers,
    })

    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }

    return closestCenter({
      ...args,
      droppableContainers: siblingContainers,
    })
  }
}

// ============================================
// MEASURING CONFIG
// ============================================

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

// ============================================
// DND PROVIDER COMPONENT
// ============================================

export const DndProvider = ({ children, onDragEnd }: DndProviderProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  // Custom collision detection - her renderda aynı referans
  const collisionDetection = createSiblingOnlyCollision()

  // Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)

    if (!over) return
    if (active.id === over.id) return

    onDragEnd(active.id as string, over.id as string)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  // Context value
  const contextValue: DndContextValue = {
    activeId,
    isDragging: activeId !== null,
  }

  return (
    <DndStateContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        measuring={measuringConfig}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {children}

        <DragOverlay></DragOverlay>
      </DndContext>
    </DndStateContext.Provider>
  )
}

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
} from '@dnd-kit/core'
import { PropsWithChildren } from 'react'
import { useEmailStore } from '../store'

const customCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  if (pointerCollisions.length > 0) {
    return pointerCollisions
  }
  return closestCenter(args)
}

export const EmailDndProvider = ({ children }: PropsWithChildren) => {
  const { moveBlock, getBlock } = useEmailStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const isDescendant = (parentId: string, childId: string): boolean => {
    const parent = getBlock(parentId)
    if (!parent || parent.type !== 'container') return false

    const checkChildren = (container: ContainerBlock): boolean => {
      for (const child of container.children) {
        if (child.id === childId) return true
        if (child.type === 'container') {
          if (checkChildren(child as ContainerBlock)) return true
        }
      }
      return false
    }

    return checkChildren(parent as ContainerBlock)
  }

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      console.log('Drop cancelled or same position')
      return
    }

    const sourceId = active.id as string
    const targetId = over.id as string

    const targetBlock = getBlock(targetId)
    if (!targetBlock || targetBlock.type !== 'container') {
      console.log('Target is not a container, ignoring drop')
      return
    }

    if (isDescendant(sourceId, targetId)) {
      console.log('Cannot drop a parent into its child')
      return
    }

    console.log(`Moving ${sourceId} into ${targetId}`) // ← Syntax düzeltildi
    moveBlock(sourceId, targetId)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  )
}

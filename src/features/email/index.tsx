import { useModalStore } from '@/features/modals/store'
import { useEmailStore, useEmailTemporal } from './store'
import { RecursiveRenderer } from './editor'
import { DndProvider } from './providers/dnd-provider'
import { CSSProperties } from 'react'

// ============================================
// MAIN EDITOR COMPONENT
// ============================================

interface EmailEditorProps {
  onClose: () => void
}

const EmailEditorContent = ({ onClose }: EmailEditorProps) => {
  return (
    <div className="relative flex h-dvh w-screen flex-col bg-stone-100 font-sans text-stone-800">
      {/* Header */}
      <header className="pointer-events-auto z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6">
        <div>
          <h2 className="text-lg font-bold">Email Builder</h2>
          <span className="text-xs text-stone-500">v2.1 - Depth Preserved</span>
        </div>
        <button
          onClick={onClose}
          className="rounded bg-stone-100 px-4 py-2 text-sm hover:bg-stone-200"
        >
          Kapat
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbox />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  )
}

// ============================================
// TOOLBOX COMPONENT
// ============================================

const Toolbox = () => {
  const { addBlock } = useEmailStore()
  const { undo, redo, pastStates, futureStates } = useEmailTemporal()

  const handleAdd = (type: EmailBlockType, styles?: CSSProperties) => {
    const id = crypto.randomUUID()
    let newBlock: EmailBlock

    switch (type) {
      case 'container':
        newBlock = {
          id,
          type: 'container',
          children: [],
          styles: {
            padding: '10px',
            border: '1px dashed #e5e5e5',
            display: 'flex',
            flexDirection: styles?.flexDirection ? styles.flexDirection : 'column',
            gap: '4px',
            minHeight: '50px',
            width: '100%',
          },
        }
        break
      case 'text':
        newBlock = {
          id,
          type: 'text',
          content: 'Lorem ipsum dolor sit amet.',
          styles: { fontSize: '14px', color: '#333' },
        }
        break
      case 'button':
        newBlock = {
          id,
          type: 'button',
          content: 'Click Me',
          props: { url: '#' },
          styles: {
            backgroundColor: '#000',
            color: '#fff',
            padding: '6px 6px 6px 6px',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '16px',
            display: 'inline-block',
          },
        }
        break
      case 'image':
        newBlock = {
          id,
          type: 'image',
          props: { src: 'https://via.placeholder.com/300x150', alt: 'Placeholder' },
          styles: { width: '100%', height: 'auto' },
        }
        break
      default:
        return
    }

    addBlock(newBlock)
  }

  const canUndo = pastStates.length > 0
  const canRedo = futureStates.length > 0

  return (
    <div className="flex w-56 flex-col gap-4 overflow-y-auto border-r border-stone-200 bg-white p-4">
      {/* Insert Section */}
      <section>
        <h3 className="mb-2 text-xs font-bold text-stone-400 uppercase">Insert</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleAdd('container', { flexDirection: 'row' })}
            className="rounded border border-stone-200 bg-stone-50 px-3 py-2 text-left text-sm capitalize hover:bg-stone-100"
          >
            Container Row
          </button>
          {(['container', 'text', 'button', 'image'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleAdd(type)}
              className="rounded border border-stone-200 bg-stone-50 px-3 py-2 text-left text-sm capitalize hover:bg-stone-100"
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* History Section */}
      <section>
        <h3 className="mb-2 text-xs font-bold text-stone-400 uppercase">History</h3>
        <div className="flex gap-2">
          <button
            onClick={() => undo()}
            disabled={!canUndo}
            className="flex-1 rounded bg-stone-800 px-3 py-2 text-xs text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Undo
          </button>
          <button
            onClick={() => redo()}
            disabled={!canRedo}
            className="flex-1 rounded bg-stone-800 px-3 py-2 text-xs text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Redo
          </button>
        </div>
      </section>
    </div>
  )
}

// ============================================
// CANVAS COMPONENT
// ============================================

const Canvas = () => {
  const { blocks, reorderBlock } = useEmailStore()

  const rootBlock = blocks.find((b) => b.id === 'root')

  // DragEnd handler - store'a delege et
  const handleDragEnd = (activeId: string, overId: string) => {
    reorderBlock(activeId, overId)
  }

  return (
    <div className="flex flex-1 justify-center overflow-y-auto bg-stone-100 p-10">
      <DndProvider onDragEnd={handleDragEnd} renderOverlay={() => null}>
        <div className="min-h-150 w-150 rounded-lg bg-white shadow-xl">
          {rootBlock && <RecursiveRenderer block={rootBlock} />}
        </div>
      </DndProvider>
    </div>
  )
}

// ============================================
// PROPERTIES PANEL
// ============================================

const PropertiesPanel = () => {
  const { selected, getBlock } = useEmailStore()
  const selectedBlock = selected ? getBlock(selected) : null

  return (
    <aside className="w-64 border-l border-stone-200 bg-white p-4">
      <h3 className="text-xs font-bold text-stone-400 uppercase">Properties</h3>

      {selectedBlock ? (
        <div className="mt-4 space-y-3">
          <div>
            <span className="text-xs text-stone-500">Type</span>
            <p className="text-sm font-medium capitalize">{selectedBlock.type}</p>
          </div>
          <div>
            <span className="text-xs text-stone-500">ID</span>
            <p className="font-mono text-xs text-stone-600">{selectedBlock.id.slice(0, 8)}...</p>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-xs text-stone-500">Select a block to edit.</p>
      )}
    </aside>
  )
}

// ============================================
// MODAL TRIGGER
// ============================================

export const RenderDemoModal = () => {
  const { open } = useModalStore()
  return (
    <button
      type="button"
      onClick={() => open(EmailEditorContent)}
      className="absolute top-2 right-6 my-4 hidden h-12 rounded-lg bg-stone-600 px-6 font-mono text-xs font-medium text-white hover:bg-stone-700 lg:block"
    >
      EMAIL BUILDER
    </button>
  )
}

export default EmailEditorContent

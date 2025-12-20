import { CSSProperties } from 'react'
import { useEmailStore, useEmailTemporal } from '../../store'

export const Toolbox = () => {
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
            height: 'fit-content',
            minHeight: '60px',
            width: '100%',
          },
        }
        break
      case 'text':
        newBlock = {
          id,
          type: 'text',
          content: 'Lorem ipsum dolor sit amet.',
          styles: { fontSize: '14px', color: 'inherit' },
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
          {(['container', 'text', 'button', 'image'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleAdd(type)}
              className="rounded border border-stone-200 bg-stone-50 px-3 py-2 text-left text-sm font-semibold capitalize hover:bg-stone-100"
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
            className="flex-1 rounded bg-stone-800 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Geri
          </button>
          <button
            onClick={() => redo()}
            disabled={!canRedo}
            className="flex-1 rounded bg-stone-800 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            İleri
          </button>
        </div>
      </section>
    </div>
  )
}

import { useModalStore } from '@/features/modals/store'
import { Code } from 'lucide-react'
import { EditorBlockRenderer } from './editor'
import { useEmailStore, useEmailTemporal } from './store'
import { EmailDndProvider } from './context/dragable-dnd'

interface DemoProps {
  onClose: () => void
}

const EmailEditorContent = ({ onClose }: DemoProps) => {
  const handleLogHtml = async () => {}

  return (
    <EmailDndProvider>
      <div className="relative flex h-dvh w-screen flex-col items-start justify-start overflow-y-auto bg-stone-100 font-mono text-stone-800">
        <div className="fixed z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6">
          <div>
            <h2 className="font-custom-commuters text-lg font-semibold">Email Editör</h2>
            <span className="font-mono text-xs text-stone-500">version : 0</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded px-4 py-2 text-sm">
              Kapat
            </button>
            <button
              onClick={handleLogHtml}
              className="flex items-center gap-2 rounded bg-black px-4 py-2 text-sm text-white"
            >
              Console <Code size={16} />
            </button>
          </div>
        </div>
        <Toolbox />
        <LivePreview />
      </div>
    </EmailDndProvider>
  )
}

// Toolbox
const Toolbox = () => {
  const { addContainer, mergeContainers, splitContainer, removeContainer, selected } =
    useEmailStore()
  const { undo, redo } = useEmailTemporal()

  const handleAddContainer = () => {
    addContainer()
  }

  const handleMerge = () => {
    mergeContainers(selected)
  }

  const handleSplit = () => {
    splitContainer(selected[0])
  }

  const handleRemove = () => {
    removeContainer(selected[0])
  }

  return (
    <div className="fixed top-0 left-0 z-40 flex h-dvh min-w-48 flex-col items-start gap-4 overflow-y-auto border-r border-stone-200 bg-white p-4 pt-20 text-start">
      <button
        className="h-10 w-full rounded bg-stone-800 px-6 text-start text-white hover:bg-stone-900"
        onClick={handleAddContainer}
      >
        Add
      </button>
      <button
        className="h-10 w-full rounded bg-stone-800 px-6 text-start text-white hover:bg-stone-900"
        onClick={handleMerge}
      >
        Merge ({selected.length})
      </button>
      <button
        className="h-10 w-full rounded bg-stone-800 px-6 text-start text-white hover:bg-stone-900"
        onClick={handleSplit}
      >
        Split
      </button>

      <button
        className="h-10 w-full rounded bg-stone-800 px-6 text-start text-white hover:bg-stone-900"
        onClick={handleRemove}
      >
        Remove
      </button>

      <button
        className="h-10 w-full rounded bg-stone-800 px-6 text-start text-white hover:bg-stone-900"
        onClick={() => undo()}
      >
        Geri Al
      </button>

      <button
        className="h-10 w-full rounded bg-stone-800 px-6 text-start text-white hover:bg-stone-900"
        onClick={() => redo()}
      >
        İleri Al
      </button>
    </div>
  )
}

const LivePreview = () => {
  const { blocks, setSelected } = useEmailStore()

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelected([])
    }
  }

  return (
    <div
      className="relative z-30 mx-auto w-full max-w-150 translate-x-24 bg-stone-100 pt-20 pb-2"
      onClick={handleBackgroundClick}
    >
      <div className="min-h-150 w-full rounded-sm bg-white shadow-2xl">
        {blocks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 text-stone-400">
            <p>Henüz içerik yok.</p>
          </div>
        ) : (
          blocks.map((block) => <EditorBlockRenderer key={block.id} block={block} />)
        )}
      </div>
    </div>
  )
}

export const RenderDemoModal = () => {
  const { open } = useModalStore()

  return (
    <button
      type="button"
      onClick={() => open(EmailEditorContent)}
      className="absolute top-2 right-6 my-4 hidden h-12 rounded-lg bg-stone-600 px-6 font-mono text-xs font-medium text-white hover:bg-stone-700 lg:block"
    >
      TEST FEATURE
    </button>
  )
}

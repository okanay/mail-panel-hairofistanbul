import { useModalStore } from '@/features/modals/store'
import { EditorSheel } from './editor/canvas'
import { PropertiesPanel } from './editor/properties'
import { Toolbox } from './editor/toolbox'

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
      <div className="pointer-events-auto z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6">
        <div>
          <h2 className="text-lg font-bold">Email Builder</h2>
          <span className="text-xs text-stone-500">v0.1 - Age Of Panels</span>
        </div>
        <button
          onClick={onClose}
          className="rounded bg-stone-100 px-4 py-2 text-sm hover:bg-stone-200"
        >
          Kapat
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbox />
        <EditorSheel />
        <PropertiesPanel />
      </div>
    </div>
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

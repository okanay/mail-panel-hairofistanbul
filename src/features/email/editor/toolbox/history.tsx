import { useEmailTemporal } from '../../store'

export const ToolboxHistory = () => {
  const { undo, redo, pastStates, futureStates } = useEmailTemporal()

  const canUndo = pastStates.length > 0
  const canRedo = futureStates.length > 0

  return (
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
  )
}

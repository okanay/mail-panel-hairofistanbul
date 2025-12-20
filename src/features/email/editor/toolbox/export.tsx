import { Download } from 'lucide-react'

export const ToolboxExport = () => {
  return (
    <div className="flex flex-col gap-2">
      <button className="flex h-10 items-center justify-center gap-2 rounded bg-stone-800 px-3 text-left text-xs font-semibold text-white hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-50">
        <Download size={14} />
        Export HTML
      </button>
    </div>
  )
}

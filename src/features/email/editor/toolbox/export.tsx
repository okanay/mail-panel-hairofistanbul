import { Download } from 'lucide-react'
import { useState } from 'react'
import { useEmailStore } from '../../store'

export const ToolboxExport = () => {
  const { exportToHTML } = useEmailStore()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportHTML = async () => {
    setIsExporting(true)
    try {
      const html = await exportToHTML()

      await navigator.clipboard.writeText(html)
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `email-${Date.now()}.html`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleExportHTML}
        disabled={isExporting}
        className="flex h-10 items-center justify-center gap-2 rounded bg-stone-800 px-3 text-left text-xs font-semibold text-white hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download size={14} />
        {isExporting ? 'Exporting...' : 'Export HTML'}
      </button>
    </div>
  )
}

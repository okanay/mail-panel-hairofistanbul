import { pretty, render } from '@react-email/render'
import { useEmailStore } from '../../store'
import { Download, Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { ExportSheel } from '../canvas'

export const ToolboxExport = () => {
  const { blocks, getBlock } = useEmailStore()
  const [loading, setLoading] = useState(false)

  const handleExport = useCallback(async () => {
    setLoading(true)
    try {
      const rootBlock = getBlock('root') as RootBlock

      const html = await pretty(await render(<ExportSheel rootBlock={rootBlock} />), {
        pretty: true,
      })

      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'email.html'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }, [blocks])

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleExport}
        disabled={loading}
        className="flex h-10 items-center justify-center gap-2 rounded bg-stone-800 px-3 text-left text-xs font-semibold text-white transition-colors hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        Export HTML
      </button>
    </div>
  )
}

import { useEmailStore } from '../../store'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

export const ToolboxExport = () => {
  const { exportToHTML } = useEmailStore()
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      // 1. HTML String'i al
      const html = await exportToHTML()

      if (!html) throw new Error('HTML üretilemedi')

      // 2. Blob oluştur
      const blob = new Blob([html], { type: 'text/html' })

      // 3. İndirme bağlantısı oluştur
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `email-template-${Date.now()}.html`

      // 4. Tıkla ve temizle
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export sırasında bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

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

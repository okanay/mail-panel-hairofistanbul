import { useEmailStore, useEmailTemporal } from '../../store'
import { pretty, render } from '@react-email/render'
import { ExportSheel } from '../canvas'
import {
  Type,
  Image as ImageIcon,
  MousePointer2,
  Undo2,
  Redo2,
  Download,
  Loader2,
  Heading,
} from 'lucide-react'
import { useCallback, useState } from 'react'

const generateId = () => crypto.randomUUID()

const createText = (content: string = 'Lorem ipsum dolor sit amet.'): TextBlock => ({
  id: generateId(),
  type: 'text',
  content,
  props: {
    style: {
      fontSize: '16px',
      lineHeight: '24px',
      color: '#4a4a4a',
      margin: '0 0 16px 0',
    },
  },
})

const createButton = (): ButtonBlock => ({
  id: generateId(),
  type: 'button',
  content: 'Button Text',
  props: {
    href: '#',
    style: {
      backgroundColor: '#007bff',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '4px',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'inline-block',
      textAlign: 'center',
    },
  },
})

const createImage = (): ImageBlock => ({
  id: generateId(),
  type: 'image',
  props: {
    src: 'https://picsum.photos/600/300',
    alt: 'Placeholder Image',
    width: '100%',
    style: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '4px',
    },
  },
})

export const Toolbox = () => {
  const { addBlock, selected, getBlock, blocks } = useEmailStore()
  const { undo, redo, pastStates, futureStates } = useEmailTemporal()
  const [exporting, setExporting] = useState(false)

  const selectedBlock = selected ? getBlock(selected) : null
  const selectedType = selectedBlock?.type || 'root'

  const handleAddText = () => addBlock(createText())
  const handleAddButton = () => addBlock(createButton())
  const handleAddImage = () => addBlock(createImage())

  const handleExport = useCallback(async () => {
    setExporting(true)
    try {
      const rootBlock = getBlock('root') as RootBlock
      const html = await pretty(await render(<ExportSheel rootBlock={rootBlock} />), {
        pretty: true,
      })
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'email-template.html'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }, [blocks, getBlock])

  return (
    <div className="flex h-full w-80 flex-col border-r border-stone-200 bg-white font-sans text-stone-800">
      <div className="flex items-center justify-between border-b border-stone-200 p-4">
        <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">Toolbox</span>
        <div className="flex gap-1">
          <button
            onClick={() => undo()}
            disabled={pastStates.length === 0}
            className="rounded p-1.5 hover:bg-stone-100 disabled:opacity-30"
            title="Geri Al"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={() => redo()}
            disabled={futureStates.length === 0}
            className="rounded p-1.5 hover:bg-stone-100 disabled:opacity-30"
            title="İleri Al"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="mb-3 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            Düzen (Layout)
          </h3>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            İçerik (Elements)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <ToolboxButton icon={<Type size={18} />} label="Metin" onClick={handleAddText} />
            <ToolboxButton
              icon={<MousePointer2 size={18} />}
              label="Buton"
              onClick={handleAddButton}
            />
            <ToolboxButton icon={<ImageIcon size={18} />} label="Görsel" onClick={handleAddImage} />
            <ToolboxButton
              icon={<Heading size={18} />}
              label="Başlık"
              onClick={() => addBlock(createText('<h2>Başlık</h2>'))}
            />
          </div>
        </div>

        <div className="mt-4 rounded bg-blue-50 p-3 text-xs text-blue-700">
          <span className="mb-1 block font-bold uppercase opacity-70">
            Seçili: {selectedType.toUpperCase()}
          </span>
          <p className="opacity-80">
            {selectedType === 'root'
              ? 'Sayfaya yeni bir bölüm eklemek için yukarıdaki düzenleri kullanın.'
              : selectedType === 'section' || selectedType === 'column'
                ? 'İçeriği zenginleştirmek için elementleri sürükleyebilir veya tıklayabilirsiniz.'
                : 'Ayarlar panelinden özellikleri düzenleyebilirsiniz.'}
          </p>
        </div>
      </div>

      <div className="border-t border-stone-200 p-4">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex w-full items-center justify-center gap-2 rounded bg-stone-900 py-2.5 text-xs font-semibold text-white transition-all hover:bg-stone-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          HTML İndir
        </button>
      </div>
    </div>
  )
}

interface ToolboxButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

const ToolboxButton = ({ icon, label, onClick }: ToolboxButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-2 rounded border border-stone-200 bg-white py-3 transition-all hover:border-blue-400 hover:bg-blue-50 active:scale-95"
    >
      <div className="text-stone-500 transition-colors group-hover:text-blue-600">{icon}</div>
      <span className="text-[11px] font-medium text-stone-600 group-hover:text-blue-700">
        {label}
      </span>
    </button>
  )
}

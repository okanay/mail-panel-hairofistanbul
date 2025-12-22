import { useEmailStore, useEmailTemporal } from '../../store'
import { pretty, render } from '@react-email/render'
import {
  Type,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Download,
  Loader2,
  Link2,
  ColumnsIcon,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { ExportSheel } from '../renderer/export'

const generateId = () => crypto.randomUUID()

const createTwoColumnLayout = (): SectionBlock => {
  return {
    id: crypto.randomUUID(),
    type: 'section',
    props: { style: { width: '100%', height: '64px' }, children: undefined },
    children: [
      {
        id: crypto.randomUUID(),
        type: 'row',
        props: { style: { width: '100%', padding: '0px' }, children: undefined },
        children: [
          {
            id: crypto.randomUUID(),
            type: 'column',
            props: { style: { width: '50%', padding: '0px' } },
            children: [createText('Sol Taraf')],
          },
          {
            id: crypto.randomUUID(),
            type: 'column',
            props: { style: { width: '50%', padding: '0px' } },
            children: [createText('Sağ Taraf')],
          },
        ],
      },
    ],
  }
}

const createText = (content: string = 'Lorem ipsum dolor sit amet.'): TextBlock => ({
  id: generateId(),
  type: 'text',
  content,
  props: {
    style: {
      fontSize: '16px',
      lineHeight: '16px',
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
      borderRadius: '0px',
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
      display: 'block',
    },
  },
})

export const Toolbox = () => {
  const { addBlock, getBlock, blocks } = useEmailStore()
  const { undo, redo, pastStates, futureStates } = useEmailTemporal()
  const [exporting, setExporting] = useState(false)

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
    <div className="fixed top-0 left-0 h-dvh w-68 overflow-hidden overflow-y-auto border-r border-stone-200 bg-white pt-16">
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
          <div className="grid grid-cols-2 gap-2">
            <ToolboxButton
              icon={<ColumnsIcon />}
              label="2 Kolon"
              onClick={() => addBlock(createTwoColumnLayout())}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
            İçerik (Elements)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <ToolboxButton icon={<Type size={18} />} label="Metin" onClick={handleAddText} />
            <ToolboxButton icon={<Link2 size={18} />} label="Buton" onClick={handleAddButton} />
            <ToolboxButton icon={<ImageIcon size={18} />} label="Görsel" onClick={handleAddImage} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 z-20 w-full border-t border-stone-200 p-4">
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
      className="group flex items-center justify-center gap-2 rounded border border-stone-200 bg-white py-3 transition-all hover:border-blue-400 hover:bg-blue-50 active:scale-95"
    >
      <span className="text-xs font-medium text-stone-600 group-hover:text-blue-700">{label}</span>
      <div className="text-stone-500 transition-colors group-hover:text-blue-600">{icon}</div>
    </button>
  )
}

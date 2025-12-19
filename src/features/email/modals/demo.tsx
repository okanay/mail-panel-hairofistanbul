import { useModalStore } from '@/features/modals/store'
import { useEmailStore } from '../store'
import { Code, Type } from 'lucide-react'
import { EditableTextBlock } from '../components/blocks/text'

interface DemoProps {
  onClose: () => void
}

const EmailEditorContent = ({ onClose }: DemoProps) => {
  const { getEmailTemplate } = useEmailStore()

  const handleLogHtml = async () => {
    const htmlString = await getEmailTemplate()
    console.log(htmlString)
  }

  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-white font-mono text-stone-800">
      <div className="z-20 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6">
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

      <div className="flex flex-1 overflow-hidden">
        <Toolbox />
        <LivePreview />
      </div>
    </div>
  )
}

const Toolbox = () => {
  const { addBlock } = useEmailStore()

  const handleAddText = () => {
    addBlock({
      type: 'text',
      id: crypto.randomUUID(),
      content: 'Buraya tıklayıp metni düzenleyebilirsiniz.',
      styles: 'text-base text-stone-700 leading-relaxed',
    })
  }

  return (
    <div className="flex w-64 flex-col gap-4 border-r border-stone-200 bg-stone-50 p-4">
      <h3 className="font-mono text-xs font-bold uppercase">İçerik Ekle</h3>
      <button
        onClick={handleAddText}
        className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-3 text-left transition-all hover:border-primary-500 hover:shadow-sm"
      >
        <div className="rounded bg-primary-100 p-2 text-primary-600">
          <Type size={18} />
        </div>
        <span className="text-sm font-medium text-stone-700">Metin Bloğu</span>
      </button>
      <h3 className="font-mono text-xs font-bold uppercase">TODO LIST</h3>
      <ul className="flex flex-col gap-y-2 text-xs italic">
        <li>Dinamik olarak ayarlanabilir ekran genişliği (L3)</li>
        <li>Tailwind CSS sınıfları globals.css'de olmasa bile eklenebiliyor mu? (L3)</li>
        <li>Spesifik bir metin için font ekleme (L3)</li>
        <li>Editör modalındaki Toolbox sayfa yüksekliğini takip etmeli. (L1) </li>
        <li>Dökümanın sabit bir padding olması style vermeyi limitliyor. (L1)</li>
      </ul>
    </div>
  )
}

const LivePreview = () => {
  const { blocks } = useEmailStore()

  return (
    <div className="flex flex-1 justify-center overflow-y-auto bg-slate-100 p-8">
      <div
        className="min-h-150 w-full max-w-150 rounded-sm bg-white p-10 shadow-2xl"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {blocks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 text-stone-400">
            <p>Henüz içerik yok.</p>
          </div>
        ) : (
          blocks.map((block) => <EditableTextBlock key={block.id} block={block} />)
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
      className="absolute top-2 right-6 my-4 h-10 rounded-lg bg-stone-600 px-6 text-sm font-medium text-white"
    >
      Email Editör
    </button>
  )
}

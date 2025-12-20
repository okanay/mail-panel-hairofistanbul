import { useEmailStore } from '../../store'

export const ToolboxAddImage = () => {
  const { addBlock } = useEmailStore()

  const handleAdd = () => {
    const id = crypto.randomUUID()
    let newBlock: EmailBlock

    newBlock = {
      id,
      type: 'image',
      props: { src: 'https://via.placeholder.com/300x150', alt: 'Placeholder' },
      styles: { width: '100%', height: 'auto' },
    }

    addBlock(newBlock)
  }

  return (
    <button
      onClick={() => handleAdd()}
      className="rounded border border-stone-200 bg-stone-50 px-3 py-2 text-left text-sm font-semibold capitalize hover:bg-stone-100"
    >
      Image
    </button>
  )
}

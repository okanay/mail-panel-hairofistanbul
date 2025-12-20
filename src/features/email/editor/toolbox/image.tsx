import { useEmailStore } from '../../store'

export const ToolboxAddImage = () => {
  const { addBlock } = useEmailStore()

  const handleAdd = () => {
    const id = crypto.randomUUID()
    let newBlock: ImageBlock

    newBlock = {
      id,
      type: 'image',
      props: { src: 'https://via.placeholder.com/300x150', alt: 'Placeholder' },
    }

    addBlock(newBlock)
  }

  return (
    <button
      onClick={() => handleAdd()}
      className="h-10 rounded bg-stone-800 px-4 text-left text-xs font-medium text-stone-100 uppercase hover:bg-stone-900"
    >
      Image
    </button>
  )
}

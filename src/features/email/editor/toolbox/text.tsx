import { useEmailStore } from '../../store'

export const ToolboxAddText = () => {
  const { addBlock } = useEmailStore()

  const handleAdd = () => {
    const id = crypto.randomUUID()
    let newBlock: EmailBlock

    newBlock = {
      id,
      type: 'text',
      content: 'Lorem ipsum dolor sit amet.',
      styles: { fontSize: '14px', color: 'inherit' },
    }

    addBlock(newBlock)
  }

  return (
    <button
      onClick={() => handleAdd()}
      className="rounded border border-stone-200 bg-stone-50 px-3 py-2 text-left text-sm font-semibold capitalize hover:bg-stone-100"
    >
      Text
    </button>
  )
}

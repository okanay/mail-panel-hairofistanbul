import { useEmailStore } from '../../store'

export const ToolboxAddText = () => {
  const { addBlock } = useEmailStore()

  const handleAdd = () => {
    const id = crypto.randomUUID()
    let newBlock: TextBlock

    newBlock = {
      id,
      type: 'text',
      content: 'Lorem ipsum dolor sit amet.',
      styles: {},
      props: {},
    }

    addBlock(newBlock)
  }

  return (
    <button
      onClick={() => handleAdd()}
      className="h-10 rounded bg-stone-800 px-4 text-left text-xs font-medium text-stone-100 uppercase hover:bg-stone-900"
    >
      Text
    </button>
  )
}

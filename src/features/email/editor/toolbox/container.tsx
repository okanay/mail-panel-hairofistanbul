import { useEmailStore } from '../../store'

export const ToolboxAddContainer = () => {
  const { addBlock } = useEmailStore()

  const handleAdd = () => {
    const id = crypto.randomUUID()
    let newBlock: EmailBlock

    newBlock = {
      id,
      type: 'container',
      children: [],
      styles: {
        padding: '10px',
        border: '1px dashed #e5e5e5',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        height: 'fit-content',
        minHeight: '60px',
        width: '100%',
      },
    }

    addBlock(newBlock)
  }

  return (
    <button
      onClick={() => handleAdd()}
      className="h-10 bg-stone-800 px-4 text-left text-xs font-medium text-stone-100 uppercase hover:bg-stone-900"
    >
      Container
    </button>
  )
}

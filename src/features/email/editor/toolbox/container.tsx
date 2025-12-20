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
      className="rounded border border-stone-200 bg-stone-50 px-3 py-2 text-left text-sm font-semibold capitalize hover:bg-stone-100"
    >
      Container
    </button>
  )
}

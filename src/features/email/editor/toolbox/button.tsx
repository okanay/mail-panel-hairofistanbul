import { useEmailStore } from '../../store'

export const ToolboxAddButton = () => {
  const { addBlock } = useEmailStore()

  const handleAdd = () => {
    const id = crypto.randomUUID()
    let newBlock: EmailBlock

    newBlock = {
      id,
      type: 'button',
      content: 'Click Me',
      props: { url: '#' },
      styles: {
        backgroundColor: '#000',
        color: '#fff',
        padding: '6px 6px 6px 6px',
        borderRadius: '4px',
        textAlign: 'center',
        fontSize: '16px',
        display: 'inline-block',
      },
    }

    addBlock(newBlock)
  }

  return (
    <button
      onClick={() => handleAdd()}
      className="rounded border border-stone-200 bg-stone-50 px-3 py-2 text-left text-sm font-semibold capitalize hover:bg-stone-100"
    >
      Button
    </button>
  )
}

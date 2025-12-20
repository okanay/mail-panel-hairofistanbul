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
      className="h-10 bg-stone-800 px-4 text-left text-xs font-medium text-stone-100 uppercase hover:bg-stone-900"
    >
      Button
    </button>
  )
}

import { useEmailStore } from '../../store'

export const ToolboxAddContainer = () => {
  const { addBlock } = useEmailStore()

  const handleAdd = () => {
    const id = crypto.randomUUID()
    let newBlock: EmailBlock

    newBlock = {
      id,
      type: 'container',
      props: {
        style: {
          minHeight: '60px',
          border: '1px dashed grey',
        },
      },
      children: [],
    }

    addBlock(newBlock)
  }

  return (
    <button
      onClick={() => handleAdd()}
      className="h-10 rounded bg-stone-800 px-4 text-left text-xs font-medium text-stone-100 uppercase hover:bg-stone-900"
    >
      Container
    </button>
  )
}

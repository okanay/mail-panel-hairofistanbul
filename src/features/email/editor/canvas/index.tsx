import { useEmailStore } from '../../store'
import { BlockRootContainer } from '../renderer/root'

export const Canvas = () => {
  const { blocks, setSelected } = useEmailStore()

  const rootBlock = blocks.find((b) => b.id === 'root') as RootBlock

  return (
    <div
      onClick={() => setSelected(null)}
      className="flex h-full flex-1 flex-col items-center justify-start overflow-y-auto bg-stone-100 px-4 py-12"
    >
      <div className="relative min-h-150 w-full max-w-150 bg-white shadow-xl">
        <BlockRootContainer block={rootBlock} />
      </div>
    </div>
  )
}

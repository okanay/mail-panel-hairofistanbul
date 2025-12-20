import { useEmailStore } from '../../store'

export const Canvas = () => {
  const { blocks } = useEmailStore()

  return (
    <div className="flex flex-1 justify-center overflow-y-auto bg-primary-50 py-8">
      <div className="min-h-150 w-150 rounded-lg bg-white shadow-xl">{JSON.stringify(blocks)}</div>
    </div>
  )
}

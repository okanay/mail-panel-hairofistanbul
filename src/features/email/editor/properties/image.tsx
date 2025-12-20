interface ImagePropertiesProps {
  block: ImageBlock
}

export const ImageProperties = ({ block }: ImagePropertiesProps) => {
  return (
    <div className="mt-4 flex flex-col gap-y-3">
      <h3 className="px-4 text-xs font-medium text-stone-500 uppercase">Properties</h3>

      <div className="flex flex-col items-start justify-between gap-y-1 border-b border-stone-200 px-4 pb-4">
        <span className="text-xs text-stone-500">Type</span>
        <p className="text-xs font-medium">Image</p>
        <div>
          <span className="text-xs text-stone-500">ID</span>
          <p className="font-mono text-xs text-stone-600">{block.id.slice(0, 8)}...</p>
        </div>
      </div>

      <div className="flex flex-col gap-y-3 px-4"></div>
    </div>
  )
}

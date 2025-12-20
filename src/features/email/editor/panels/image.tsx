interface ImagePropertiesProps {
  block: ImageBlock
}

export const ImageProperties = ({ block }: ImagePropertiesProps) => {
  return (
    <div className="mt-4 flex flex-col gap-y-3">
      <h3 className="px-4 text-xs font-bold text-stone-400 uppercase">Properties</h3>
      <div className="px-4">
        <span className="text-xs text-stone-500">Type</span>
        <p className="text-sm font-medium">Image</p>
      </div>
      <div className="px-4">
        <span className="text-xs text-stone-500">Source</span>
        <p className="text-xs break-all text-stone-600">{block.props.src}</p>
      </div>
      <div className="px-4">
        <span className="text-xs text-stone-500">Alt Text</span>
        <p className="text-xs text-stone-600">{block.props.alt}</p>
      </div>
    </div>
  )
}

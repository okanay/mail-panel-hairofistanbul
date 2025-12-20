interface ButtonPropertiesProps {
  block: ButtonBlock
}

export const ButtonProperties = ({ block }: ButtonPropertiesProps) => {
  return (
    <div className="mt-4 space-y-3">
      <div>
        <span className="text-xs text-stone-500">Type</span>
        <p className="text-sm font-medium">Button</p>
      </div>
      <div>
        <span className="text-xs text-stone-500">Text</span>
        <p className="text-xs text-stone-600">{block.content}</p>
      </div>
      <div>
        <span className="text-xs text-stone-500">URL</span>
        <p className="text-xs text-stone-600">{block.props.url}</p>
      </div>
      {/* Buraya button-specific inputlar gelecek */}
    </div>
  )
}

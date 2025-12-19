export const EditableImageBlock = ({ block }: { block: ImageBlock }) => {
  return (
    <div id={block.id} className={`inline-block`} style={block.styles}>
      <img
        src={block.props.src}
        alt={block.props.alt}
        width={block.props.width}
        height={block.props.height}
        className="block h-auto max-w-full"
      />
    </div>
  )
}

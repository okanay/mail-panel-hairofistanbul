export const EditableTextBlock = ({ block }: { block: TextBlock }) => {
  return (
    <div
      id={block.id}
      data-block={`text-${block.id}`}
      className={`my-2 inline-block`}
      style={block.styles}
    >
      {block.content}
    </div>
  )
}

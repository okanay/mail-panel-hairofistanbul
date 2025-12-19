export const EditableButtonBlock = ({ block }: { block: ButtonBlock }) => {
  return (
    <div id={block.id} style={block.styles}>
      <a
        href={block.props.url}
        target={block.props.target}
        className="pointer-events-none block h-full w-full"
        onClick={(e) => e.preventDefault()}
      >
        {block.content}
      </a>
    </div>
  )
}

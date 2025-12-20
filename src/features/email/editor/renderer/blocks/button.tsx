export const BlockButton = ({ block }: { block: ButtonBlock }) => (
  <a style={{ ...block.styles }} href={block.props.url}>
    {block.content}
  </a>
)

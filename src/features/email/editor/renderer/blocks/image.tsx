export const BlockImage = ({ block }: { block: ImageBlock }) => (
  <img style={{ ...block.styles }} src={block.props.src} alt={block.props.alt} draggable={false} />
)

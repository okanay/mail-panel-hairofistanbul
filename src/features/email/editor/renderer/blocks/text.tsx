export const BlockText = ({ block }: { block: TextBlock }) => (
  <p contentEditable style={{ ...block.styles }}>
    {block.content}
  </p>
)

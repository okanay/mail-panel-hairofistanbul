import { Button } from '@react-email/components'

export const RenderButton = ({ block }: { block: ButtonBlock }) => (
  <Button {...block.props}>{block.content}</Button>
)

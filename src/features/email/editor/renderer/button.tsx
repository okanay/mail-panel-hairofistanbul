import { Button } from '@react-email/components'

export const BlockButton = ({ block }: { block: ButtonBlock }) => (
  <Button {...block.props}>{block.content}</Button>
)

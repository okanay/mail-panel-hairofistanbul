import { Text } from '@react-email/components'

export const BlockText = ({ block }: { block: TextBlock }) => (
  <Text {...block.props}>{block.content}</Text>
)

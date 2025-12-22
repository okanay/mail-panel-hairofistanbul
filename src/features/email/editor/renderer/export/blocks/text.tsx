import { Text } from '@react-email/components'

export const RenderText = ({ block }: { block: TextBlock }) => (
  <Text {...block.props}>{block.content}</Text>
)

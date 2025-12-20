import { Container } from '@react-email/components'
import { RecursiveRenderer } from '.'

export const BlockContainer = ({ block }: { block: ContainerBlock }) => {
  return (
    <Container {...block.props}>
      {block.children.map((child) => (
        <RecursiveRenderer key={child.id} block={child} />
      ))}
    </Container>
  )
}

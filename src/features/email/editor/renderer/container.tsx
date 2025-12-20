import { Container } from '@react-email/components'
import { RecursiveRenderer } from '.'

export const BlockContainer = ({ block }: { block: ContainerBlock }) => {
  const hasChildren = block.children && block.children.length > 0

  return (
    <Container {...block.props}>
      {!hasChildren ? (
        <span>Element Ekleyin</span>
      ) : (
        block.children.map((child) => <RecursiveRenderer key={child.id} block={child} />)
      )}
    </Container>
  )
}

import { Container } from '@react-email/components'
import { EditorComponentRenderer, ExportComponentRenderer } from '.'

export const EditorBlockContainer = ({ block }: { block: ContainerBlock }) => {
  return (
    <Container {...block.props}>
      {block.children.map((child) => (
        <EditorComponentRenderer key={child.id} block={child} />
      ))}
    </Container>
  )
}

export const ExportBlockContainer = ({ block }: { block: ContainerBlock }) => {
  return (
    <Container {...block.props}>
      {block.children.map((child) => (
        <ExportComponentRenderer key={child.id} block={child} />
      ))}
    </Container>
  )
}

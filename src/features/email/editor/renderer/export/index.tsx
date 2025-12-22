import { Body, Container, Head, Html } from '@react-email/components'
import { ExportComponentRenderer } from './blocks'

export const ExportSheel = ({ rootBlock }: { rootBlock: RootBlock }) => {
  return (
    <Html lang="tr">
      <Head />
      <Body style={rootBlock.props?.style}>
        <Container
          style={{
            backgroundColor: '#ffffff',
            margin: '0 auto',
            maxWidth: '600px',
            border: '1px solid #e5e5e5',
          }}
        >
          {rootBlock.children.map((child) => (
            <ExportComponentRenderer key={child.id} block={child} />
          ))}
        </Container>
      </Body>
    </Html>
  )
}

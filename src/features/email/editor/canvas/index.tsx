import { Body, Container, Head, Html } from '@react-email/components'
import { useEmailStore } from '../../store'
import { EditorComponentRenderer, ExportComponentRenderer } from '../renderer'

export const EditorSheel = () => {
  const { setSelected, blocks } = useEmailStore()

  const rootBlock = blocks.find((b) => b.id === 'root') as RootBlock

  return (
    <Container
      id="editor-sheel"
      onClick={() => setSelected(null)}
      style={{
        margin: '0 auto',
        padding: '40px 0px',
      }}
    >
      <Container
        align="center"
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 650,
          width: 465,
          backgroundColor: 'white',
          border: '1px solid #eaeaea',
        }}
      >
        {rootBlock.children.map((child) => (
          <EditorComponentRenderer key={child.id} block={child} />
        ))}
      </Container>
    </Container>
  )
}

export const ExportSheel = ({ rootBlock }: { rootBlock: RootBlock }) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          margin: '0 auto',
          padding: '40px 0px',
        }}
      >
        <Container
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 650,
            width: 465,
            backgroundColor: 'white',
            border: '1px solid #eaeaea',
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

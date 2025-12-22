import { Body, Container, Head, Html } from '@react-email/components'
import { useEmailStore } from '../../store'
import { EditorComponentRenderer, ExportComponentRenderer } from '../renderer'

// --- EDITOR MODE ---
export const EditorSheel = () => {
  const { setSelected, blocks } = useEmailStore()
  const rootBlock = blocks.find((b) => b.id === 'root') as RootBlock

  // Root özelliklerini alalım (Body stilleri)
  const rootStyles = rootBlock.props?.style || {}

  return (
    <div
      id="editor-shell"
      onClick={() => setSelected(null)}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: rootStyles.backgroundColor || '#f6f9fc',
        fontFamily: rootStyles.fontFamily || 'sans-serif',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 0',
      }}
    >
      <div
        style={{
          width: '600px',
          minHeight: '600px',
          height: 'fit-content',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5e5',
          position: 'relative',
        }}
        onClick={(e) => {
          e.stopPropagation()
          setSelected('root')
        }}
      >
        {rootBlock.children.map((child) => (
          <EditorComponentRenderer key={child.id} block={child} />
        ))}
      </div>
    </div>
  )
}

// --- EXPORT MODE ---
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

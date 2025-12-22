import { useEmailStore } from '@/features/email/store'
import { EditorComponentRenderer } from './blocks'

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
        padding: '40px 0px',
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

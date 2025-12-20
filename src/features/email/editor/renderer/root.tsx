import { RecursiveRenderer } from '.'

export const BlockRootContainer = ({ block }: { block: RootBlock }) => {
  return (
    <div
      id="email-canvas-root"
      style={{
        ...block.props?.style,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
      }}
      lang={block.props?.lang}
      dir={block.props?.dir}
    >
      {block.children.map((child) => (
        <RecursiveRenderer key={child.id} block={child} />
      ))}
    </div>
  )
}

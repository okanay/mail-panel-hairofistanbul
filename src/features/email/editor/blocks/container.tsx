import { EditorBlockRenderer } from '..'

export const EditableContainerBlock = ({ block }: { block: ContainerBlock }) => {
  return (
    <div
      id={block.id}
      className="group relative z-10 min-h-12.5 border border-dashed border-primary-200 transition-all duration-200 hover:border-primary-400"
    >
      {block.children.map((child) => (
        <EditorBlockRenderer key={child.id} block={child} />
      ))}

      {/* Boş Container İpucu */}
      {block.children.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center border border-dashed border-gray-200 bg-gray-50/50 text-xs text-gray-400">
          Boş Alan
        </div>
      )}
    </div>
  )
}

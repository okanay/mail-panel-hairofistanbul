import { EditorBlockRenderer } from '..'
import { useEmailStore } from '../../store'

export const EditableContainerBlock = ({
  block,
  depth = 0,
}: {
  block: ContainerBlock
  depth?: number
}) => {
  const { selected, setSelected, hovered, setHovered } = useEmailStore()
  const isSelected = selected.includes(block.id)
  const isHovered = hovered === block.id

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (e.shiftKey) {
      if (isSelected) {
        setSelected(selected.filter((id) => id !== block.id))
      } else {
        setSelected([...selected, block.id])
      }
    } else {
      setSelected([])
    }
  }

  return (
    <div id={block.id} style={block.styles} className="relative">
      <div
        onClick={handleClick}
        onMouseEnter={() => setHovered(block.id)}
        onMouseLeave={() => setHovered(null)}
        data-selected={isSelected}
        data-hovered={isHovered}
        className="mb-2 min-h-12.5 cursor-pointer border-2 border-dashed border-gray-200 p-2 transition-colors data-[hovered=true]:border-gray-400 data-[hovered=true]:bg-gray-50 data-[selected=true]:border-primary-500 data-[selected=true]:bg-primary-50"
        style={{
          marginLeft: depth === 0 ? '0px' : `${4 * depth}px`,
          marginTop: depth === 0 ? '0px' : '4px',
        }}
      >
        {block.children.length === 0 && (
          <div className="text-xs text-gray-400">Empty Container (depth: {depth})</div>
        )}

        {block.children.map((child) => (
          <EditorBlockRenderer key={child.id} block={child} depth={depth + 1} />
        ))}
      </div>
    </div>
  )
}

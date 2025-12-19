import { useState, useRef, useEffect } from 'react'
import { useEmailStore } from '../../store'

export const EditableTextBlock = ({ block }: { block: EmailBlock }) => {
  const { updateBlock } = useEmailStore()
  const [isFocused, setIsFocused] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== block.content) {
      contentRef.current.innerText = block.content
    }
  }, [block.content])

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(false)
    const newContent = e.currentTarget.innerText
    if (newContent !== block.content) {
      updateBlock(block.id, { content: newContent })
      console.log(`Block ${block.id} güncellendi:`, newContent)
    }
  }

  return (
    <div className="group relative mb-2">
      {isFocused && (
        <div className="absolute -top-6 left-0 z-10 flex items-center gap-2 rounded-t-md bg-blue-600 px-2 py-1 text-xs text-white">
          <span>Metin Düzenleniyor</span>
        </div>
      )}

      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning={true}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={`min-h-[1.5em] transition-all outline-none ${block.styles} ${isFocused ? 'rounded bg-blue-50/50 ring-2 ring-blue-500 ring-offset-2' : 'border border-transparent hover:border-dashed hover:border-gray-300 hover:bg-gray-50'} `}
      >
        {block.content}
      </div>
    </div>
  )
}

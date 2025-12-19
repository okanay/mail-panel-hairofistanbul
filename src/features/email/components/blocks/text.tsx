import { useState, useRef, useEffect } from 'react'
import { useEmailStore } from '../../store'
import { twMerge } from 'tailwind-merge'
import {
  AArrowUp,
  Bold,
  Italic,
  List,
  MarsStroke,
  PaintBucket,
  Strikethrough,
  Text,
  TypeOutline,
  Underline,
} from 'lucide-react'

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
    <div onBlur={handleBlur} onFocus={() => setIsFocused(true)} className="group relative mb-2">
      {isFocused && (
        <div className="absolute -top-6 left-2 z-10 flex items-center gap-2">
          <button className="size-5 rounded-sm bg-stone-200 p-1 text-stone-900 hover:bg-current/16 focus:bg-current/18 active:bg-current/18">
            <Bold className="size-full" />
          </button>
          <button className="size-5 rounded-sm bg-stone-200 p-1 text-stone-900 hover:bg-current/16 focus:bg-current/18 active:bg-current/18">
            <Italic className="size-full" />
          </button>
          <button className="size-5 rounded-sm bg-stone-200 p-1 text-stone-900 hover:bg-current/16 focus:bg-current/18 active:bg-current/18">
            <Underline className="size-full" />
          </button>
          <button className="size-5 rounded-sm bg-stone-200 p-1 text-stone-900 hover:bg-current/16 focus:bg-current/18 active:bg-current/18">
            <List className="size-full" />
          </button>
          <button className="size-5 rounded-sm bg-stone-200 p-1 text-stone-900 hover:bg-current/16 focus:bg-current/18 active:bg-current/18">
            <PaintBucket className="size-full" />
          </button>
          <button className="size-5 rounded-sm bg-stone-200 p-1 text-stone-900 hover:bg-current/16 focus:bg-current/18 active:bg-current/18">
            <TypeOutline className="size-full" />
          </button>
          <button className="size-5 rounded-sm bg-stone-200 p-1 text-stone-900 hover:bg-current/16 focus:bg-current/18 active:bg-current/18">
            <Strikethrough className="size-full" />
          </button>
        </div>
      )}

      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning={true}
        className={twMerge(
          'min-h-[1.5em] border border-dashed border-transparent transition-all outline-none hover:border-current/20 hover:bg-current/12',
          block.styles,
          isFocused && 'border-solid! border-current/20 bg-current/12',
        )}
      >
        {block.content}
      </div>
    </div>
  )
}

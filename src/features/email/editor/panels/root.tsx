import { CSSProperties } from 'react'
import { useEmailStore } from '../../store'
import { PropertyText } from './ui/property-text'

export const RootProperties = () => {
  const { updateBlock, getBlock } = useEmailStore()
  const rootBlock = getBlock('root')!

  const handleStyleChange = (key: keyof CSSProperties, value: string) => {
    updateBlock('root', {
      styles: {
        [key]: value,
      },
    })
  }

  return (
    <div className="mt-4 flex flex-col gap-y-3">
      <h3 className="px-4 text-xs font-medium text-stone-500 uppercase">Properties</h3>

      <div className="flex flex-col items-start justify-between gap-y-1 border-b border-stone-200 px-4 pb-4">
        <span className="text-xs text-stone-500">Type</span>
        <p className="text-xs font-medium">Root</p>
      </div>

      <div className="flex flex-col gap-y-3 px-4">
        <PropertyText
          label="Z-Index"
          styleKey="zIndex"
          value={rootBlock.styles?.zIndex}
          placeholder="0"
          onBlur={handleStyleChange}
        />

        <PropertyText
          label="Gap"
          styleKey="gap"
          value={rootBlock.styles?.gap}
          placeholder="4px"
          onBlur={handleStyleChange}
        />

        <PropertyText
          label="Background"
          styleKey="backgroundColor"
          value={rootBlock.styles?.backgroundColor}
          placeholder="#ffffff"
          onBlur={handleStyleChange}
        />

        <PropertyText
          label="Color"
          styleKey="color"
          value={rootBlock.styles?.color}
          placeholder="#00000"
          onBlur={handleStyleChange}
        />
      </div>
    </div>
  )
}

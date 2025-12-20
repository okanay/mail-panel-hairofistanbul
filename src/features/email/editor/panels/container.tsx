import { CSSProperties } from 'react'
import { useEmailStore } from '../../store'
import { PropertySelect } from './ui/property-select'
import { PropertyText } from './ui/property-text'

interface ContainerPropertiesProps {
  block: ContainerBlock
}

export const ContainerProperties = ({ block }: ContainerPropertiesProps) => {
  const { updateBlock } = useEmailStore()

  const handleStyleChange = (key: keyof CSSProperties, value: string) => {
    updateBlock(block.id, {
      styles: {
        [key]: value,
      },
    })
  }

  const isNotRelative = block.styles?.position !== 'relative'

  return (
    <div className="mt-4 flex flex-col gap-y-3">
      <h3 className="px-4 text-xs font-medium text-stone-500 uppercase">Properties</h3>

      <div className="flex flex-col items-start justify-between gap-y-1 border-b border-stone-200 px-4 pb-4">
        <span className="text-xs text-stone-500">Type</span>
        <p className="text-xs font-medium">Container</p>
        <div>
          <span className="text-xs text-stone-500">ID</span>
          <p className="font-mono text-xs text-stone-600">{block.id.slice(0, 8)}...</p>
        </div>
      </div>

      <div className="flex flex-col gap-y-3 px-4">
        <PropertySelect
          label="Direction"
          value={(block.styles?.flexDirection as string) || 'column'}
          options={[
            { value: 'column', label: 'Column' },
            { value: 'row', label: 'Row' },
          ]}
          onChange={(value) => handleStyleChange('flexDirection', value)}
        />

        <PropertySelect
          label="Position"
          value={(block.styles?.position as string) || 'relative'}
          options={[
            { value: 'relative', label: 'Relative' },
            { value: 'absolute', label: 'Absolute' },
            { value: 'fixed', label: 'Fixed' },
            { value: 'sticky', label: 'Sticky' },
          ]}
          onChange={(value) => handleStyleChange('position', value)}
        />

        <PropertyText
          label="Z-Index"
          styleKey="zIndex"
          value={block.styles?.zIndex}
          placeholder="0"
          onBlur={handleStyleChange}
        />

        {isNotRelative && (
          <>
            <PropertyText
              label="Top"
              styleKey="top"
              value={block.styles?.top}
              placeholder="0px"
              onBlur={handleStyleChange}
            />

            <PropertyText
              label="Left"
              styleKey="left"
              value={block.styles?.left}
              placeholder="0px"
              onBlur={handleStyleChange}
            />
          </>
        )}

        <PropertyText
          label="Gap"
          styleKey="gap"
          value={block.styles?.gap}
          placeholder="4px"
          onBlur={handleStyleChange}
        />

        <PropertyText
          label="Padding"
          styleKey="padding"
          value={block.styles?.padding}
          placeholder="4px"
          onBlur={handleStyleChange}
        />

        <PropertyText
          label="Width"
          styleKey="width"
          value={block.styles?.width}
          placeholder="0px"
          onBlur={handleStyleChange}
        />

        <PropertyText
          label="Height"
          styleKey="height"
          value={block.styles?.height}
          placeholder="0px"
          onBlur={handleStyleChange}
        />

        <PropertyText
          label="Background"
          styleKey="backgroundColor"
          value={block.styles?.backgroundColor}
          placeholder="#ffffff"
          onBlur={handleStyleChange}
        />

        <PropertyText
          label="Color"
          styleKey="color"
          value={block.styles?.color}
          placeholder="#00000"
          onBlur={handleStyleChange}
        />

        <PropertyText
          label="Border"
          styleKey="border"
          value={block.styles?.border}
          placeholder="1px solid #000000"
          onBlur={handleStyleChange}
        />
      </div>
    </div>
  )
}

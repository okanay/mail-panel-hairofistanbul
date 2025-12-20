import { CSSProperties, useEffect, useState } from 'react'

interface PropertyTextProps {
  label: string
  styleKey: keyof CSSProperties
  value: CSSProperties[keyof CSSProperties]
  placeholder?: string
  onBlur: (key: keyof CSSProperties, value: string) => void
}

export const PropertyText = ({
  label,
  styleKey,
  value,
  placeholder,
  onBlur,
}: PropertyTextProps) => {
  const [localValue, setLocalValue] = useState(String(value || ''))

  // Block değiştiğinde value güncellenir, local state'i senkronize et
  useEffect(() => {
    setLocalValue(String(value || ''))
  }, [value])

  const handleBlur = () => {
    onBlur(styleKey, localValue)
  }

  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-stone-500">{label}</label>
      <input
        type="text"
        value={localValue}
        placeholder={placeholder}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        className="w-28 rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-700 outline-none focus:border-blue-500"
      />
    </div>
  )
}

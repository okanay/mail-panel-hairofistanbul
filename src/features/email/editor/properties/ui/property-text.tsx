import { useEffect, useState } from 'react'

interface PropertyTextProps {
  label: string
  value: string
  placeholder?: string
  onBlur: (value: string) => void
}

export const PropertyText = ({ label, value, placeholder, onBlur }: PropertyTextProps) => {
  const [localValue, setLocalValue] = useState(String(value || ''))

  useEffect(() => {
    setLocalValue(String(value || ''))
  }, [value])

  const handleBlur = () => {
    onBlur(localValue)
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
        className="w-40 rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-700 outline-none focus:border-blue-500"
      />
    </div>
  )
}

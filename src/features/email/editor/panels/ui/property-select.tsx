import { useEffect, useState } from 'react'

interface PropertySelectProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

export const PropertySelect = ({ label, value, options, onChange }: PropertySelectProps) => {
  const [localValue, setLocalValue] = useState(value)

  // Block değiştiğinde value güncellenir
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (newValue: string) => {
    setLocalValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-stone-500">{label}</label>
      <select
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className="w-28 rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-700 outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

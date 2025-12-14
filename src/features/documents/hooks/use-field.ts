import { useMemo } from 'react'

export const useField = <T extends readonly FormFieldConfig[]>(formData: T) => {
  type FieldKey = T[number]['editKey']
  type ExtractField<K extends FieldKey> = Extract<T[number], { editKey: K }>

  const fieldMap = useMemo(() => {
    const map = new Map<string, FormFieldConfig>()
    formData.forEach((field) => {
      map.set(field.editKey, field)
    })
    return map
  }, [formData])

  // Function overload ile tip güvenliği sağlıyoruz
  function f<K extends FieldKey>(id: K): ExtractField<K> {
    const field = fieldMap.get(id as string)
    if (!field) {
      throw new Error(`Field with id "${id}" not found in formData`)
    }
    return field as ExtractField<K>
  }

  return f
}

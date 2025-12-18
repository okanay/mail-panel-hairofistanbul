// <T extends FormFieldConfig[]>
// "T, FormFieldConfig array'i kurallarına uyan HERHANGİ bir sabit liste olabilir"
// (API'dan gelmeyen, compile time'da ne olduğunu bildiğimiz)

// <K extends T[number]['editKey']>
// "K, T içindeki field'ların editKey'lerinden BİRİ olmalı"
// (T listesinin keylerinden biri: 'd1-p4-k1' | 'd1-p4-k2' gibi)

export const useField = <T extends FornModeInputConfig[]>(formData: T) => {
  const fieldMap = new Map<string, FornModeInputConfig>()

  formData.forEach((field) => {
    fieldMap.set(field.editKey, field)
  })

  function f<K extends T[number]['editKey']>(editKey: K): Extract<T[number], { editKey: K }> {
    const field = fieldMap.get(editKey as string)

    if (!field) {
      throw new Error(`Field with id "${editKey}" not found`)
    }

    return field as Extract<T[number], { editKey: K }>
  }

  return f
}

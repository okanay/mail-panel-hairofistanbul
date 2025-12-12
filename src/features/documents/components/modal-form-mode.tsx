import { useGlobalModalStore } from '@/features/modals/store'
import { useState } from 'react'
import { DocumentStore } from '../store'
import { Info, X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface FormModeModalProps {
  onClose: () => void
  formData: DocumentFormData
  store: DocumentStore
}

export function FormModeModal({ onClose, formData, store }: FormModeModalProps) {
  const [formValues, setFormValues] = useState<Record<string, string | boolean | LinkData>>(() => {
    const initialValues: Record<string, string | boolean | LinkData> = {}

    formData.forEach((field) => {
      const storeValue = store.edits[field.editKey]
      let finalValue: string | boolean | LinkData

      if (storeValue !== undefined) {
        finalValue = storeValue
      } else if (field.seedValue !== undefined) {
        finalValue = field.seedValue
      } else {
        finalValue = field.defaultValue
      }

      initialValues[field.editKey] = finalValue
    })

    console.log('Complete initial values:', initialValues)
    return initialValues
  })

  const handleChange = (editKey: string, value: string | boolean | LinkData) => {
    setFormValues((prev) => ({
      ...prev,
      [editKey]: value,
    }))
  }

  const handleSave = () => {
    Object.entries(formValues).forEach(([editKey, value]) => {
      store.setEdit(editKey, value)
    })
    onClose()
  }

  const handleReset = () => {
    const resetValues: Record<string, string | boolean | LinkData> = {}

    formData.forEach((field) => {
      resetValues[field.editKey] = field.seedValue ?? field.defaultValue
    })

    setFormValues(resetValues)
  }

  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-white md:h-auto md:max-h-[85vh] md:w-2xl md:max-w-2xl md:rounded-lg md:shadow-2xl">
      <FormHeader onClose={onClose} />

      <FormContent formData={formData} formValues={formValues} onChange={handleChange} />

      <FormFooter onReset={handleReset} onSave={handleSave} />
    </div>
  )
}

// ============================================================================
// HEADER
// ============================================================================

interface FormHeaderProps {
  onClose: () => void
}

const FormHeader = ({ onClose }: FormHeaderProps) => {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
      <div>
        <h2 className="text-lg font-bold text-gray-950">Form Modu</h2>
        <p className="mt-0.5 text-xs text-gray-500">Doküman içeriğini düzenleyin</p>
      </div>
      <button
        onClick={onClose}
        className="group flex size-8 items-center justify-center rounded-full border border-gray-100 bg-gray-50 transition-colors hover:border-gray-200 hover:bg-red-50"
      >
        <X className="size-4 text-gray-500 transition-colors group-hover:text-red-600" />
      </button>
    </div>
  )
}

// ============================================================================
// CONTENT
// ============================================================================

interface FormContentProps {
  formData: DocumentFormData
  formValues: Record<string, string | boolean | LinkData>
  onChange: (editKey: string, value: string | boolean | LinkData) => void
}

const FormContent = ({ formData, formValues, onChange }: FormContentProps) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 px-6 py-4">
      <div className="space-y-4">
        {formData.map((field) => (
          <FormField
            key={field.editKey}
            field={field}
            value={formValues[field.editKey]}
            onChange={(value) => onChange(field.editKey, value)}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// FOOTER
// ============================================================================

interface FormFooterProps {
  onReset: () => void
  onSave: () => void
}

const FormFooter = ({ onReset, onSave }: FormFooterProps) => {
  return (
    <div className="shrink-0 border-t border-gray-100 bg-white px-6 py-4">
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-sm border border-gray-300 bg-white px-4 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Sıfırla
        </button>
        <button
          onClick={onSave}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-sm border border-zinc-950/10 bg-primary px-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90"
        >
          Kaydet
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// FORM FIELD ROUTER
// ============================================================================

interface FormFieldProps {
  field: FormFieldConfig
  value: string | boolean | LinkData
  onChange: (value: string | boolean | LinkData) => void
}

const FormField = ({ field, value, onChange }: FormFieldProps) => {
  switch (field.inputMode) {
    case 'text':
      return <TextInput field={field} value={value as string} onChange={onChange} />

    case 'textarea':
      return <TextareaInput field={field} value={value as string} onChange={onChange} />

    case 'toggle':
      return <ToggleInput field={field} value={value as boolean} onChange={onChange} />

    case 'link':
      return <LinkInput field={field} value={value as LinkData} onChange={onChange} />

    default:
      return null
  }
}

// ============================================================================
// TEXT INPUT
// ============================================================================

interface TextInputProps {
  field: FormFieldConfig
  value: string
  onChange: (value: string) => void
}

const TextInput = ({ field, value, onChange }: TextInputProps) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{field.name}</label>
      {field.description && (
        <p className="flex items-center gap-x-2 rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-600">
          <Info className="size-3" />
          {field.description}
        </p>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}

// ============================================================================
// TEXTAREA INPUT
// ============================================================================

interface TextareaInputProps {
  field: FormFieldConfig
  value: string
  onChange: (value: string) => void
}

const TextareaInput = ({ field, value, onChange }: TextareaInputProps) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{field.name}</label>
      {field.description && (
        <p className="flex items-center gap-x-2 rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-600">
          <Info className="size-3" />
          {field.description}
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}

// ============================================================================
// TOGGLE INPUT
// ============================================================================

interface ToggleInputProps {
  field: FormFieldConfig
  value: boolean
  onChange: (value: boolean) => void
}

const ToggleInput = ({ field, value, onChange }: ToggleInputProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">{field.name}</label>
        {field.description && (
          <p className="flex items-center gap-x-2 rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-600">
            <Info className="size-3" />
            {field.description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(!value)}
        data-active={value}
        className="relative h-6 w-11 rounded-full bg-gray-200 transition-colors data-[active=true]:bg-primary"
      >
        <span
          data-active={value}
          className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform data-[active=true]:translate-x-5"
        />
      </button>
    </div>
  )
}

// ============================================================================
// LINK INPUT
// ============================================================================

interface LinkInputProps {
  field: FormFieldConfig
  value: LinkData
  onChange: (value: LinkData) => void
}

const LinkInput = ({ field, value, onChange }: LinkInputProps) => {
  const handleTypeChange = (type: LinkData['type']) => {
    onChange({ ...value, type })
  }

  const handleValueChange = (newValue: string) => {
    onChange({ ...value, value: newValue })
  }

  const getPlaceholder = () => {
    switch (value.type) {
      case 'mailto':
        return 'email@example.com'
      case 'tel':
        return '+90 555 123 45 67'
      case 'https':
        return 'example.com'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{field.name}</label>
      {field.description && (
        <p className="flex items-center gap-x-2 rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-600">
          <Info className="size-3" />
          {field.description}
        </p>
      )}
      {/* Type Selector */}
      <div className="flex overflow-hidden rounded-lg border border-gray-200">
        {(['https', 'mailto', 'tel'] as const).map((linkType) => {
          const isActive = value.type === linkType
          return (
            <button
              key={linkType}
              type="button"
              onClick={() => handleTypeChange(linkType)}
              className={twMerge(
                'flex-1 px-3 py-2 text-xs font-medium uppercase transition-colors',
                isActive ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
              )}
            >
              {linkType === 'https' ? 'Web' : linkType === 'mailto' ? 'Mail' : 'Tel'}
            </button>
          )
        })}
      </div>

      {/* Value Input */}
      <input
        type="text"
        value={value.value}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder={getPlaceholder()}
        className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}

// ============================================================================
// HOOK
// ============================================================================

export const useFormModeModal = () => {
  const { open } = useGlobalModalStore()

  const openFormModeModal = ({
    formData,
    store,
  }: {
    formData: DocumentFormData
    store: DocumentStore
  }) => {
    open(FormModeModal as any, { formData, store })
  }

  return { openFormModeModal }
}

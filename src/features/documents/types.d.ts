type DocumentPathsLocation =
  | '/docs'
  | '/docs/en/with-otel'
  | '/docs/en/without-otel'
  | '/docs/en/without-otel-transfer'
  | '/docs/tr/with-otel'
  | '/docs/tr/without-otel'
  | '/docs/tr/without-otel-transfer'

type DocumentPaths = DocumentPathsLocation & keyof RegisteredRouter['routesByPath']
type DocumentLanguage = 'tr' | 'en'
type DocumentContentType = 'with-otel' | 'without-otel' | 'without-otel-transfer'

type DocumentConfig = {
  language: DocumentLanguage
  type: DocumentContentType
  from: DocumentPaths
}

type FormFieldInputMode = 'text' | 'textarea' | 'toggle' | 'link'

type LinkData = {
  value: string
  type: 'mailto' | 'tel' | 'https'
}

type FieldBase = {
  name: string
  description?: string
  editKey: string
}

interface TextFieldConfig extends FieldBase {
  defaultValue: string
  seedValue?: string | null
  inputMode: Extract<FormFieldInputMode, 'text' | 'textarea'>
}

interface ToggleFieldConfig extends FieldBase {
  defaultValue: boolean
  seedValue?: boolean
  inputMode: 'toggle'
}

interface LinkFieldConfig extends FieldBase {
  defaultValue: LinkData
  seedValue?: LinkData
  inputMode: 'link'
}

type FormFieldConfig = TextFieldConfig | LinkFieldConfig | ToggleFieldConfig

// Union type for all possible form values
type FormFieldValue = string | boolean | LinkData | null

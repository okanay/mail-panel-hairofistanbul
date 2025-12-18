// ---------------
// DOCUMENT CONFIG
// ---------------
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
type DocumentVersion = 'v1'

// ---------------
// FORM MODE
// ---------------

type ForModeInputModes = 'text' | 'textarea' | 'toggle' | 'link'

type FormModeLinkInputData = {
  value: string
  type: 'mailto' | 'tel' | 'https'
}

type FormModeInputBaseConfig = {
  name: string
  description?: string
  editKey: string
}

interface FormModeTextInputConfig extends FormModeInputBaseConfig {
  defaultValue: string
  seedValue?: string | null
  inputMode: Extract<ForModeInputModes, 'text' | 'textarea'>
}

interface FormModeToggleInputConfig extends FormModeInputBaseConfig {
  defaultValue: boolean
  seedValue?: boolean
  inputMode: 'toggle'
}

interface FormModeLinkInputConfig extends FormModeInputBaseConfig {
  defaultValue: FormModeLinkInputData
  seedValue?: FormModeLinkInputData
  inputMode: 'link'
}

type FornModeInputConfig =
  | FormModeTextInputConfig
  | FormModeLinkInputConfig
  | FormModeToggleInputConfig

// Union type for all possible form values
type FormModeInputValue = string | boolean | FormModeLinkInputData | null

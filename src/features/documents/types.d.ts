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

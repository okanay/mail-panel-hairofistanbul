import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Building2, Car, FileText } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })

  const [selectedLanguage, setSelectedLanguage] = useState<DocumentLanguage>(
    search.language || 'en',
  )

  const handleSwitchLanguage = (code: DocumentLanguage) => {
    setSelectedLanguage(code)
    navigate({
      search: () => ({
        ...search,
        language: code,
      }),
    })
  }

  const languages: { code: DocumentLanguage; label: string }[] = [
    { code: 'en', label: 'İngilizce' },
    { code: 'tr', label: 'Türkçe' },
  ]

  const documentTypes = [
    {
      title: 'Tam Paket',
      subtitle: 'Otel + Transfer',
      description: 'Konaklama ve havalimanı transfer hizmeti dahil tam kapsamlı paket',
      route: `/docs/${selectedLanguage}/with-otel`,
      icon: Building2,
    },
    {
      title: 'Transfer Paketi',
      subtitle: 'Transfer Dahil',
      description: 'Havalimanı transfer hizmeti dahil, konaklama hariç paket seçeneği',
      route: `/docs/${selectedLanguage}/without-otel`,
      icon: Car,
    },
    {
      title: 'Sadece İşlem',
      subtitle: 'Temel Paket',
      description: 'Sadece medikal işlem paketi, konaklama ve ulaşım hizmetleri hariç',
      route: `/docs/${selectedLanguage}/without-otel-transfer`,
      icon: FileText,
    },
  ]

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mx-auto h-full w-full max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="font-custom-commuters text-4xl font-bold text-primary-500">
            Doküman Şablonları
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Paket tipine göre doküman şablonunu seçin ve görüntüleyin
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSwitchLanguage(lang.code)}
                className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  selectedLanguage === lang.code
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-gray-100 bg-white text-gray-700 hover:border-primary/50 hover:bg-gray-50'
                }`}
              >
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {documentTypes.map((doc) => {
            return (
              <Link
                key={doc.route}
                to={doc.route}
                search={{
                  ...search,
                  editable: 'yes',
                  showMenu: 'yes',
                }}
                className={`group relative flex h-auto w-full flex-col rounded-xl border border-gray-100 bg-white p-6`}
              >
                <div className="mb-4">
                  <h2
                    className={`mb-1 font-custom-commuters text-2xl font-bold text-gray-800 transition-colors`}
                  >
                    {doc.title}
                  </h2>
                  <p className={`text-sm font-medium`}>{doc.subtitle}</p>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-gray-600">{doc.description}</p>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-gray-800">
                  <span className="text-xs font-medium">Doküman Şablonu</span>
                  <span
                    className={`text-xs font-medium opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100`}
                  >
                    Görüntüle →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 rounded-xl border border-gray-100 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <FileText className="size-5 text-gray-600" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-800">Nasıl Çalışır?</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Yukarıdaki paket tiplerinden birini seçerek ilgili doküman şablonunu
                görüntüleyebilir, düzenleyebilir ve yazdırabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

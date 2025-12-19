import { Html, Container, Text, Tailwind, Head, Body, Font } from '@react-email/components'

type Settings = { maxWidth: string }

export const DynamicEmailRenderer = ({
  blocks,
  settings,
}: {
  blocks: EmailBlock[]
  settings: Settings
}) => {
  const containerWidth = settings?.maxWidth || '600px'

  return (
    <Tailwind>
      <Html lang="tr">
        <Head>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="sans-serif"
            webFont={{
              url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2',
              format: 'woff2',
            }}
          />
        </Head>
        <Body className="bg-white font-sans">
          <Container style={{ maxWidth: containerWidth }} className="mx-auto my-4 w-full">
            {blocks.map((block) => {
              if (block.type === 'text') {
                return (
                  <Text key={block.id} className={block.styles}>
                    {block.content}
                  </Text>
                )
              }
              return null
            })}
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}

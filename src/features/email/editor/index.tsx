import { Body, Container, Font, Head, Html, Tailwind, Text } from '@react-email/components'
import { EditableButtonBlock } from './blocks/button'
import { EditableContainerBlock } from './blocks/container'
import { EditableImageBlock } from './blocks/image'
import { EditableTextBlock } from './blocks/text'

export const EditorBlockRenderer = ({ block }: { block: EmailBlock }) => {
  switch (block.type) {
    case 'container':
    case 'column':
      return <EditableContainerBlock block={block} />
    case 'text':
      return <EditableTextBlock block={block} />
    case 'button':
      return <EditableButtonBlock block={block} />
    case 'image':
      return <EditableImageBlock block={block} />

    default:
      return <div className="text-xs text-red-500">Bilinmeyen Blok Tipi</div>
  }
}

const ReactEmailComponent = ({ block }: { block: EmailBlock }) => {
  switch (block.type) {
    case 'text':
      return <Text style={block.styles}>{block.content}</Text>
    default:
      return null
  }
}

export const ReactEmailRenderer = ({ blocks }: { blocks: EmailBlock[] }) => {
  const containerWidth = '600px'

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
            {blocks.map((block) => (
              <ReactEmailComponent key={block.id} block={block} />
            ))}
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}

import { Body, Button, Container, Head, Html, Img, Text } from '@react-email/components'

const ExportRecursiveRenderer = ({ block }: { block: EmailBlock }) => {
  switch (block.type) {
    case 'container':
      return (
        <Container style={block.props?.style} {...block.props}>
          {(block as ContainerBlock).children.map((child) => (
            <ExportRecursiveRenderer key={child.id} block={child} />
          ))}
        </Container>
      )

    case 'text':
      return (
        <Text style={block.props?.style} {...block.props}>
          {(block as TextBlock).content}
        </Text>
      )

    case 'button':
      return (
        <Button style={block.props?.style} {...block.props}>
          {(block as ButtonBlock).content}
        </Button>
      )

    case 'image':
      return <Img style={block.props?.style} {...block.props} />

    default:
      return null
  }
}

interface EmailExportTemplateProps {
  root: RootBlock
}

export const EmailExportTemplate = ({ root }: EmailExportTemplateProps) => {
  return (
    <Html lang={root.props?.lang} dir={root.props?.dir}>
      <Head></Head>
      <Body style={root.props?.style}>
        {root.children.map((child) => (
          <ExportRecursiveRenderer key={child.id} block={child} />
        ))}
      </Body>
    </Html>
  )
}

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  render,
  Section,
  Text,
} from '@react-email/components'
import type { CSSProperties } from 'react'

// ============================================
// MAIN EMAIL TEMPLATE
// ============================================

interface EmailTemplateProps {
  blocks: EmailBlock[]
  rootStyles?: CSSProperties
}

export const EmailTemplate = ({ blocks, rootStyles }: EmailTemplateProps) => {
  const rootBlock = blocks.find((b) => b.id === 'root') as ContainerBlock

  return (
    <Html>
      <Head />
      <Body style={rootBlock.styles || rootStyles}>
        <Container>
          {rootBlock.children.map((child) => (
            <BlockRenderer key={child.id} block={child} />
          ))}
        </Container>
      </Body>
    </Html>
  )
}

interface BlockRendererProps {
  block: EmailBlock
}

const BlockRenderer = ({ block }: BlockRendererProps) => {
  switch (block.type) {
    case 'container': {
      const containerBlock = block as ContainerBlock
      return (
        <Section style={containerBlock.styles}>
          {containerBlock.children.map((child) => (
            <BlockRenderer key={child.id} block={child} />
          ))}
        </Section>
      )
    }

    case 'text': {
      const textBlock = block as TextBlock
      return <Text style={textBlock.styles}>{textBlock.content}</Text>
    }

    case 'button': {
      const buttonBlock = block as ButtonBlock
      return (
        <Button
          href={buttonBlock.props.url}
          target={buttonBlock.props.target}
          style={buttonBlock.styles}
        >
          {buttonBlock.content}
        </Button>
      )
    }

    case 'image': {
      const imageBlock = block as ImageBlock
      return (
        <Img
          src={imageBlock.props.src}
          alt={imageBlock.props.alt}
          width={imageBlock.props.width}
          height={imageBlock.props.height}
          style={imageBlock.styles}
        />
      )
    }

    default:
      return null
  }
}

export const getHTMLContent = async (blocks: EmailBlock[]): Promise<string> => {
  try {
    // React Email component'ini render et
    const html = await render(<EmailTemplate blocks={blocks} />, {
      pretty: true,
    })

    return html
  } catch (error) {
    console.error('[getHTMLContent] Error rendering email:', error)
    throw new Error('Failed to generate HTML content')
  }
}

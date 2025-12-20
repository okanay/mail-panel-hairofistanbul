import type { CSSProperties } from 'react'

declare global {
  type EmailBlockType = 'container' | 'text' | 'button' | 'image'

  interface BaseBlock {
    id: string
    type: EmailBlockType
    styles?: CSSProperties
  }

  interface ContainerBlock extends BaseBlock {
    type: 'container'
    children: EmailBlock[]
  }

  interface TextBlock extends BaseBlock {
    type: 'text'
    content: string
  }

  interface ButtonBlock extends BaseBlock {
    type: 'button'
    content: string
    props: {
      url: string
      target?: '_blank' | '_self'
    }
  }

  interface ImageBlock extends BaseBlock {
    type: 'image'
    props: {
      src: string
      alt: string
      width?: number
      height?: number
    }
  }

  type EmailBlock = ContainerBlock | TextBlock | ButtonBlock | ImageBlock
}

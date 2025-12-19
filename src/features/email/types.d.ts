import type { CSSProperties } from 'react'

declare global {
  type EmailBlockType = 'container' | 'text' | 'button' | 'image' | 'columns' | 'column'

  interface BaseBlock {
    id: string
    type: EmailBlockType
    styles?: CSSProperties
  }

  // 1. CONTAINER BLOCK
  interface ContainerBlock extends BaseBlock {
    type: 'container' | 'column'
    children: EmailBlock[]
  }

  // 2. TEXT BLOCK
  interface TextBlock extends BaseBlock {
    type: 'text'
    content: string
  }

  // 3. BUTTON BLOCK
  interface ButtonBlock extends BaseBlock {
    type: 'button'
    content: string
    props: {
      url: string
      target?: '_blank' | '_self'
    }
  }

  // 4. IMAGE BLOCK
  interface ImageBlock extends BaseBlock {
    type: 'image'
    props: {
      src: string
      alt: string
      url?: string
      width?: number
      height?: number
    }
  }

  type EmailBlock = ContainerBlock | TextBlock | ButtonBlock | ImageBlock
}

import { ButtonProps, ContainerProps, ImgProps, TextProps } from '@react-email/components'
import type { CSSProperties } from 'react'

declare global {
  type EmailBlockType = 'root' | 'container' | 'text' | 'button' | 'image'

  interface BaseBlock {
    id: string
    type: EmailBlockType
    styles?: CSSProperties
  }

  interface RootBlock extends BaseBlock {
    children: EmailBlock[]
  }

  interface ContainerBlock extends BaseBlock {
    children: EmailBlock[]
    props?: ContainerProps
  }

  interface TextBlock extends BaseBlock {
    content: string
    props?: TextProps
  }

  interface ButtonBlock extends BaseBlock {
    content: string
    props?: ButtonProps
  }

  interface ImageBlock extends BaseBlock {
    props?: ImgProps
  }

  type EmailBlock = RootBlock | ContainerBlock | TextBlock | ButtonBlock | ImageBlock
}

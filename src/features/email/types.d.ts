import type {
  ButtonProps,
  ContainerProps,
  ImgProps,
  SectionProps,
  ColumnProps,
  TextProps,
  BodyProps,
  HtmlProps,
  HeadProps,
} from '@react-email/components'
import { CSSProperties } from 'react'

declare global {
  // Destekleyeceğimiz block tipleri
  type EmailBlockType =
    | 'root'
    | 'container'
    | 'section'
    | 'column'
    | 'text'
    | 'button'
    | 'image'
    | 'divider'
    | 'spacer'

  // Ortak özellikler
  interface BaseBlock {
    id: string
    type: EmailBlockType
  }

  // 1. Kapsayıcı (Parent) Blocklar
  // ----------------------------------------------------------------

  interface RootBlock extends BaseBlock {
    type: 'root'
    props?: HtmlProps
    children: EmailBlock[]
  }

  interface ContainerBlock extends BaseBlock {
    type: 'container'
    props?: ContainerProps // style, className
    children: EmailBlock[]
  }

  interface SectionBlock extends BaseBlock {
    type: 'section'
    props?: SectionProps
    children: EmailBlock[] // Genelde Column alır
  }

  interface ColumnBlock extends BaseBlock {
    type: 'column'
    props?: ColumnProps
    children: EmailBlock[]
  }

  // 2. İçerik (Leaf) Blocklar
  // ----------------------------------------------------------------

  interface TextBlock extends BaseBlock {
    type: 'text'
    content: string // Text içeriğini burada tutuyoruz
    props?: TextProps // style, vs.
  }

  interface ButtonBlock extends BaseBlock {
    type: 'button'
    content: string
    props?: ButtonProps // href, style, target
  }

  interface ImageBlock extends BaseBlock {
    type: 'image'
    props: ImgProps // src, alt, width, height zorunlu olabilir
  }

  // Union Type
  type EmailBlock =
    | RootBlock
    | ContainerBlock
    | SectionBlock
    | ColumnBlock
    | TextBlock
    | ButtonBlock
    | ImageBlock

  type BlockWithChildren = RootBlock | ContainerBlock | SectionBlock | ColumnBlock
  type BlockWithContent = TextBlock | ButtonBlock
}

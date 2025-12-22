import type {
  ButtonProps,
  ImgProps,
  SectionProps,
  ColumnProps,
  TextProps,
  BodyProps,
  RowProps,
} from '@react-email/components'
import type { CSSProperties } from 'react'

declare global {
  // 1. Ortak Ögeler.
  // ----------------------------------------------------------------

  type EmailBlockType = 'root' | 'section' | 'row' | 'column' | 'text' | 'button' | 'image'

  interface BaseBlock {
    id: string
    type: EmailBlockType
  }

  // 2. Kapsayıcı (Parent) Blocklar
  // ----------------------------------------------------------------

  interface RootBlock extends BaseBlock {
    type: 'root'
    props?: BodyProps
    children: EmailBlock[]
  }

  interface SectionBlock extends BaseBlock {
    type: 'section'
    props?: SectionProps
    children: EmailBlock[]
  }

  interface ColumnBlock extends BaseBlock {
    type: 'column'
    props?: ColumnProps
    children: EmailBlock[]
  }

  interface RowBlock extends BaseBlock {
    type: 'row'
    props?: RowProps
    children: ColumnBlock[]
  }

  // 3. İçerik (Leaf) Blocklar
  // ----------------------------------------------------------------

  interface TextBlock extends BaseBlock {
    type: 'text'
    content: string
    props?: TextProps
  }

  interface ButtonBlock extends BaseBlock {
    type: 'button'
    content: string
    props?: ButtonProps
  }

  interface ImageBlock extends BaseBlock {
    type: 'image'
    props: ImgProps
  }

  // 4. Union/Export Types
  // ----------------------------------------------------------------

  type EmailBlock =
    | RootBlock
    | SectionBlock
    | RowBlock
    | ColumnBlock
    | TextBlock
    | ButtonBlock
    | ImageBlock

  type BlockWithChildren = RootBlock | SectionBlock | RowBlock | ColumnBlock
  type BlockWithContent = TextBlock | ButtonBlock
}

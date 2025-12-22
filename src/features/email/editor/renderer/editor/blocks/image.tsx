import { Img } from '@react-email/components'
import { Ref } from 'react'

export const RenderImage = ({
  block,
  ref,
}: {
  block: ImageBlock
  ref?: Ref<any>
  isSelected?: boolean
}) => <Img ref={ref} {...block.props} style={{ maxWidth: '100%', ...block.props?.style }} />

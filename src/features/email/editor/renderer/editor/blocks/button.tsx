import { Button } from '@react-email/components'
import { Ref } from 'react'

export const RenderButton = ({
  block,
  ref,
}: {
  block: ButtonBlock
  ref?: Ref<any>
  isSelected?: boolean
}) => (
  <Button ref={ref} {...block.props}>
    {block.content}
  </Button>
)

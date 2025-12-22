import { Section } from '@react-email/components'
import { Ref } from 'react'

export const RenderSection = ({
  block,
  ref,
  Renderer,
}: {
  block: SectionBlock
  ref?: Ref<any>
  Renderer: any
}) => (
  <Section ref={ref} style={{ width: '100%', ...block.props?.style }} {...block.props}>
    {block.children.map((child) => (
      <Renderer key={child.id} block={child} />
    ))}
  </Section>
)

import { Section } from '@react-email/components'

export const RenderSection = ({ block, Renderer }: { block: SectionBlock; Renderer: any }) => (
  <Section style={{ width: '100%', ...block.props?.style }} {...block.props}>
    {block.children.map((child) => (
      <Renderer key={child.id} block={child} />
    ))}
  </Section>
)

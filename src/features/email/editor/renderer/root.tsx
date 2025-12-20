import { Body, Head, Html } from '@react-email/components'
import { RecursiveRenderer } from '.'

export const BlockRootContainer = ({ block }: { block: ContainerBlock }) => {
  return (
    <Html>
      <Head />
      <Body>
        {block.children.map((child) => (
          <RecursiveRenderer key={child.id} block={child} />
        ))}
      </Body>
    </Html>
  )
}

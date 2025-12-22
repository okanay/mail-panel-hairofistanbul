import { useEmailStore } from '@/features/email/store'
import { Text } from '@react-email/components'
import { Ref } from 'react'
import { twMerge } from 'tailwind-merge'

export const RenderText = ({
  block,
  ref,
}: {
  block: TextBlock
  ref?: Ref<any>
  isSelected?: boolean
}) => {
  const { selected } = useEmailStore()
  const isSelected = selected === block.id

  return (
    <Text
      ref={ref}
      {...block.props}
      className={twMerge(
        'relative box-border transition-all duration-200 ease-in-out',
        isSelected
          ? 'z-20 outline outline-blue-600'
          : 'hover:z-10 hover:outline hover:outline-blue-400',
      )}
    >
      {block.content}
    </Text>
  )
}

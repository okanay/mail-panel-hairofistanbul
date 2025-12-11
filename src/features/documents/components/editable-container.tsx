import { useSearch } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'

type Props = {
  children: React.ReactNode
  className?: string
}
export const EditableContainer = ({ children, className }: Props) => {
  const search = useSearch({ from: '/docs' })
  const editable = search.editable === 'yes'

  if (!editable) return children

  return <div className={twMerge('', className)}>{children}</div>
}

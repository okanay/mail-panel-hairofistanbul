import { ClientOnly, useSearch } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'

type Props = {
  children: React.ReactNode
  className?: string
}
export const InnerComponent = ({ children, className }: Props) => {
  const search = useSearch({ from: '/docs' })
  const editable = search.editable === 'yes'

  if (!editable) return children

  return <div className={twMerge('', className)}>{children}</div>
}

export const EditableContainer = ({ ...props }: Props) => {
  return (
    <ClientOnly fallback={<span className="inline-flex h-2.5 w-30 animate-pulse bg-stone-200" />}>
      <InnerComponent {...props} />
    </ClientOnly>
  )
}

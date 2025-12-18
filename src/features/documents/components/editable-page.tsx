import { twMerge } from 'tailwind-merge'

interface EditablePageProps {
  children: React.ReactNode
  className?: string
  index: number
}

export const EditablePage = ({ children, className, index }: EditablePageProps) => {
  return (
    <article
      style={{
        height: '29.7cm',
        width: '21cm',
      }}
      className={twMerge(
        'relative overflow-hidden border-t-8 border-t-primary-heavy bg-white py-[0.5cm]',
        className,
      )}
      aria-label={`Page ${index + 1}`}
    >
      <img
        src="/statue.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-0 left-0 z-10 h-full w-full opacity-8"
      />

      <div className="relative z-20 h-full">
        <div className="mb-4 flex justify-center">
          <img src="/logo-y.svg" alt="Hair Of Istanbul" className="size-24 scale-130" />
        </div>

        <div className="z-30 h-[calc(100%-10rem)] px-[1.4cm]">
          <div className={twMerge('h-full pt-2')}>{children}</div>
        </div>
      </div>

      <footer className="absolute bottom-[0.75cm] w-full">
        <p className="text-center text-sm font-medium text-stone-800" aria-label="Page number">
          {index + 1}
        </p>
      </footer>
    </article>
  )
}

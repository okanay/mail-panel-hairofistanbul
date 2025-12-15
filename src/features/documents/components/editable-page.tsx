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
        'relative overflow-hidden border-t-8 border-t-primary bg-white py-[0.5cm]',
        className,
      )}
      aria-label={`Page ${index + 1}`}
    >
      <img
        src="/statue.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-0 left-0 z-10 h-full w-full opacity-5"
      />

      <div className="relative z-20 h-full">
        <header className="mb-4 flex justify-center">
          <img src="/logo-y.svg" alt="Hair Of Istanbul" className="size-32" />
        </header>

        <main className="z-30 h-[calc(100%-10rem)] px-[1cm]">
          <div className={twMerge('h-full')}>{children}</div>
        </main>
      </div>

      <footer className="absolute bottom-[0.5cm] w-full">
        <p className="text-center text-sm font-medium text-stone-800" aria-label="Page number">
          {index + 1}
        </p>
      </footer>
    </article>
  )
}

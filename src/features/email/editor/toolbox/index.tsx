import { ToolboxAddButton } from './button'
import { ToolboxAddContainer } from './container'
import { ToolboxHistory } from './history'
import { ToolboxAddImage } from './image'
import { ToolboxAddText } from './text'

export const Toolbox = () => {
  return (
    <div className="flex w-56 flex-col gap-4 overflow-y-auto border-r border-stone-200 bg-white p-4">
      <section className="flex flex-col gap-y-2">
        <h3 className="mb-2 text-xs font-medium text-stone-500 uppercase">Bloklar</h3>
        <ToolboxAddContainer />
        <ToolboxAddText />
        <ToolboxAddButton />
        <ToolboxAddImage />
      </section>
      <section>
        <h3 className="mb-2 text-xs font-medium text-stone-500 uppercase">Kontrol</h3>
        <ToolboxHistory />
      </section>
    </div>
  )
}

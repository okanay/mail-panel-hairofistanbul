export const RootProperties = () => {
  return (
    <div className="mt-4 flex flex-col gap-y-3">
      <h3 className="px-4 text-xs font-medium text-stone-500 uppercase">Properties</h3>

      <div className="flex flex-col items-start justify-between gap-y-1 border-b border-stone-200 px-4 pb-4">
        <span className="text-xs text-stone-500">Type</span>
        <p className="text-xs font-medium">Root</p>
        <div>
          <span className="text-xs text-stone-500">ID</span>
          <p className="font-mono text-xs text-stone-600">Root</p>
        </div>
      </div>

      {/* Content & Link */}
      <div className="flex flex-col gap-y-3 border-b border-stone-200 px-4 pb-4">
        <h4 className="text-xs font-medium text-stone-400">Content</h4>
      </div>

      {/* Layout */}
      <div className="flex flex-col gap-y-3 border-b border-stone-200 px-4 pb-4">
        <h4 className="text-xs font-medium text-stone-400">Layout</h4>
      </div>

      {/* Appearance */}
      <div className="flex flex-col gap-y-3 px-4">
        <h4 className="text-xs font-medium text-stone-400">Appearance</h4>
      </div>
    </div>
  )
}

export const RootProperties = () => {
  return (
    <div className="mt-4 flex flex-col gap-y-3">
      <h3 className="px-4 text-xs font-bold text-stone-400 uppercase">Properties</h3>
      <div className="px-4">
        <span className="text-xs text-stone-500">Type</span>
        <p className="text-sm font-medium">Root Container</p>
      </div>
      <div className="px-4">
        <span className="text-xs text-stone-500">Description</span>
        <p className="text-xs text-stone-600">
          This is the main email container. All content must be placed inside this root element.
        </p>
      </div>
    </div>
  )
}

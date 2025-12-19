export const EditableTextBlock = ({ block }: { block: TextBlock }) => {
  return <div className="group relative mb-2">{JSON.stringify(block)}</div>
}

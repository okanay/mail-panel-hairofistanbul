import { EditableText, EditableTextProps } from './editable-text'

interface FieldProps {
  field: TextFieldConfig
}

export type TextFieldProps = Omit<EditableTextProps, 'editKey' | 'seedText' | 'children'> &
  FieldProps

export const EditableTextField = ({ field, ...props }: TextFieldProps) => {
  return (
    <EditableText {...props} editKey={field.editKey} seedText={field.seedValue}>
      {field.defaultValue}
    </EditableText>
  )
}

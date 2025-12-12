import { readdirSync, renameSync } from 'fs'
import { join } from 'path'

const targetDir = process.argv[2] || '.'

const weightMap: Record<string, string> = {
  Thin: 'thin',
  ExtraLight: 'extra-light',
  Light: 'light',
  Regular: 'regular',
  Medium: 'medium',
  SemiBold: 'semibold',
  Bold: 'bold',
  ExtraBold: 'extra-bold',
  Heavy: 'heavy',
  Italic: 'regular', // This is incorrect. Italic should be handled in the style.
}

const CatchRegex = /^CommutersSans-(.+?)(Italic)?\.(ttf|woff|eot|woff2)$/

const files = readdirSync(targetDir).filter((file) =>
  ['.ttf', '.woff2', '.eot', '.woff'].some((ext) => file.endsWith(ext)),
)

files.forEach((file) => {
  const match = file.match(CatchRegex)

  if (!match) {
    // Handle the standalone Italic case.  These files do not match the regex.
    if (
      file.startsWith('CommutersSans-Italic') &&
      ['.ttf', '.woff2', '.eot', '.woff'].some((ext) => file.endsWith(ext))
    ) {
      const extension = file.split('.').pop()
      const newName = `regular-italic.${extension}`
      const oldPath = join(targetDir, file)
      const newPath = join(targetDir, newName)

      try {
        renameSync(oldPath, newPath)
        console.log(`${file} → ${newName}`)
      } catch (error) {
        console.error(`Failed to rename ${file}: ${error}`)
      }
    }

    return
  }

  const [, weight, isItalicCapture, extension] = match
  const weightName = weight
  const weightNumber = weightMap[weightName.replace('Italic', '')]

  if (!weightNumber) {
    console.log(`Unknown weight: ${file}`)
    return
  }

  const isItalic = !!isItalicCapture // Convert capture group to boolean

  const style = isItalic ? 'italic' : 'normal'
  const newName = `${weightNumber}-${style}.${extension}`

  const oldPath = join(targetDir, file)
  const newPath = join(targetDir, newName)

  try {
    renameSync(oldPath, newPath)
    console.log(`${file} → ${newName}`)
  } catch (error) {
    console.error(`Failed to rename ${file}: ${error}`)
  }
})

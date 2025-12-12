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
  Black: 'black',
}

const CatchRegex = /^Inter_(\d+)pt-(.+?)(Italic)?\.ttf$/

const files = readdirSync(targetDir).filter((file) => file.endsWith('.ttf'))

files.forEach((file) => {
  const match = file.match(CatchRegex)

  if (!match) {
    return
  }

  const [, , weight, isItalic] = match
  const weightName = weight.replace('Italic', '')
  const weightNumber = weightMap[weightName]

  if (!weightNumber) {
    console.log(`Unknown weight: ${file}`)
    return
  }

  const style = isItalic ? 'italic' : 'normal'
  const newName = `${weightNumber}-${style}.ttf`

  const oldPath = join(targetDir, file)
  const newPath = join(targetDir, newName)

  renameSync(oldPath, newPath)
  console.log(`${file} → ${newName}`)
})

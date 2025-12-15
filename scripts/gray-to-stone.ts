import fs from 'fs'
import path from 'path'

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

function replaceInFile(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')

  // className içindeki gray- ifadelerini stone- ile değiştir
  const newContent = content.replace(
    /(className\s*=\s*(?:{[^}]*)?["'`][^"'`]*?)neutral-/g,
    '$1stone-',
  )

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8')
    return true
  }

  return false
}

function scanDirectory(dir: string, files: string[] = []): string[] {
  const items = fs.readdirSync(dir)

  items.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // node_modules gibi klasörleri atla
      if (item !== 'node_modules' && item !== 'dist' && item !== 'build' && item !== '.next') {
        scanDirectory(fullPath, files)
      }
    } else if (stat.isFile()) {
      const ext = path.extname(fullPath)
      if (EXTENSIONS.includes(ext)) {
        files.push(fullPath)
      }
    }
  })

  return files
}

function main() {
  console.log('🔍 Scanning src directory...')

  const srcPath = path.join(process.cwd(), 'src')

  if (!fs.existsSync(srcPath)) {
    console.error('❌ src directory not found!')
    process.exit(1)
  }

  const files = scanDirectory(srcPath)
  console.log(`📁 Found ${files.length} files\n`)

  let modifiedCount = 0
  const modifiedFiles: string[] = []

  files.forEach((file) => {
    const isModified = replaceInFile(file)
    if (isModified) {
      modifiedCount++
      modifiedFiles.push(file)
      console.log(`✅ ${path.relative(process.cwd(), file)}`)
    }
  })

  console.log(`\n📊 Summary:`)
  console.log(`   Total files scanned: ${files.length}`)
  console.log(`   Files modified: ${modifiedCount}`)

  if (modifiedFiles.length > 0) {
    console.log(`\n📝 Modified files:`)
    modifiedFiles.forEach((file) => console.log(`   - ${path.relative(process.cwd(), file)}`))
  }

  console.log(`\n✨ Done!`)
}

main()

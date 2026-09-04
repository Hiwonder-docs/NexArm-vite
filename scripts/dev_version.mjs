import { rm, cp, readFile, writeFile, access } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { spawn } from 'child_process'
import { getVersionBase, getVersionNames } from '../docs/.vitepress/site.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = join(__dirname, '..')

const version = process.argv[2]
if (!version) {
  console.error('Usage: node scripts/dev_version.mjs <version>')
  console.error('Example: node scripts/dev_version.mjs latest')
  process.exit(1)
}

const validVersions = getVersionNames()
if (!validVersions.includes(version)) {
  console.error(`Invalid version: ${version}`)
  console.error(`Valid versions: ${validVersions.join(', ')}`)
  process.exit(1)
}

const contentDirName = await resolveContentDirName(version)
const docsBase = getVersionBase(version)
const rootIndexPath = join(repositoryRoot, 'docs', 'index.md')
const versionIndexPath = join(repositoryRoot, 'content', contentDirName, 'docs', 'index.md')
const contentDir = join(repositoryRoot, 'content', contentDirName)
const docsDocsDir = join(repositoryRoot, 'docs', 'docs')
const docsStaticDir = join(repositoryRoot, 'docs', '_static')
const vitepressArgs = ['vitepress', 'dev', 'docs', ...process.argv.slice(3)]

console.log(`\n========== Starting dev server for ${version} ==========`)
console.log(`DOCS_BASE: ${docsBase}`)
console.log(`CONTENT_SOURCE: content/${contentDirName}`)

const originalRootIndex = await readFile(rootIndexPath, 'utf8')
const versionRootIndex = await readFile(versionIndexPath, 'utf8')

await writeFile(rootIndexPath, versionRootIndex)
await rm(docsDocsDir, { recursive: true, force: true })
await rm(docsStaticDir, { recursive: true, force: true })
await cp(join(contentDir, 'docs'), docsDocsDir, { recursive: true })
await cp(join(contentDir, '_static'), docsStaticDir, { recursive: true })

let restored = false
async function restoreRootIndex() {
  if (restored) {
    return
  }

  restored = true
  await writeFile(rootIndexPath, originalRootIndex)
}

const devServer = spawn('npx', vitepressArgs, {
  stdio: 'inherit',
  shell: true,
  cwd: repositoryRoot,
  env: { ...process.env, DOCS_BASE: docsBase, DOCS_VERSION: version }
})

devServer.on('exit', async (code, signal) => {
  await restoreRootIndex()
  process.exit(code ?? (signal ? 1 : 0))
})

process.on('SIGINT', () => {
  devServer.kill('SIGINT')
})

process.on('SIGTERM', () => {
  devServer.kill('SIGTERM')
})

async function resolveContentDirName(contentDirName) {
  try {
    await access(join(repositoryRoot, 'content', contentDirName, 'docs', 'index.md'))
    return contentDirName
  } catch {}

  console.error(`No content source found for ${version}: content/${contentDirName}`)
  process.exit(1)
}

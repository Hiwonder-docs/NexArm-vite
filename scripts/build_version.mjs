import { rm, cp, readFile, writeFile, access } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'
import { projectName, getVersionBase, getVersionNames } from '../docs/.vitepress/site.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = join(__dirname, '..')

const version = process.argv[2]
if (!version) {
  console.error('Usage: node scripts/build_version.mjs <version>')
  console.error('Example: node scripts/build_version.mjs latest')
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

console.log(`\n========== Building ${version} ==========`)
console.log(`DOCS_BASE: ${docsBase}`)
console.log(`CONTENT_SOURCE: content/${contentDirName}`)

// 1. Copy content to docs working directory
const contentDir = join(repositoryRoot, 'content', contentDirName)
const docsDocsDir = join(repositoryRoot, 'docs', 'docs')
const docsStaticDir = join(repositoryRoot, 'docs', '_static')
const originalRootIndex = await readFile(rootIndexPath, 'utf8')
const versionRootIndex = await readFile(versionIndexPath, 'utf8')

try {
  await writeFile(rootIndexPath, versionRootIndex)

  console.log('\n[1/3] Copying content files...')
  await rm(docsDocsDir, { recursive: true, force: true })
  await rm(docsStaticDir, { recursive: true, force: true })
  await cp(join(contentDir, 'docs'), docsDocsDir, { recursive: true })
  await cp(join(contentDir, '_static'), docsStaticDir, { recursive: true })
  console.log('  Done.')

  // 2. Build with VitePress
  console.log('\n[2/3] Building with VitePress...')
  execSync('npx vitepress build docs', {
    stdio: 'inherit',
    cwd: repositoryRoot,
    env: { ...process.env, DOCS_BASE: docsBase, DOCS_VERSION: version }
  })
  console.log('  Done.')

  // 3. Stage to projects directory
  console.log('\n[3/3] Staging to projects directory...')
  execSync('node scripts/stage_main_site.mjs', {
    stdio: 'inherit',
    cwd: repositoryRoot,
    env: { ...process.env, DOCS_PROJECT: projectName, DOCS_VERSION: version }
  })

  console.log(`\n========== ${version} build complete ==========\n`)
} finally {
  await writeFile(rootIndexPath, originalRootIndex)
}

async function resolveContentDirName(contentDirName) {
  try {
    await access(join(repositoryRoot, 'content', contentDirName, 'docs', 'index.md'))
    return contentDirName
  } catch {}

  console.error(`No content source found for ${version}: content/${contentDirName}`)
  process.exit(1)
}

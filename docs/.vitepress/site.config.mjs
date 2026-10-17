export const projectName = 'NexArm'
export const defaultVersion = 'latest'

export const versionDefinitions = [
  {
    version: 'latest',
    label: 'Latest',
    selectable: false,
    entryPath: '/docs/1_NexArm_Tutorial.html'
  },
  {
    version: 'esp32-version',
    label: 'ESP32 Version',
    description: 'ESP32 setup, motion & AI vision',
    entryPath: '/docs/1_Getting_Started_NexArm.html'
  },
  {
    version: 'imitation-learning-version',
    label: 'Imitation Learning Version',
    description: 'Getting started & imitation learning',
    entryPath: '/docs/1_Getting_Started_NexArm.html'
  },
  {
    version: 'ros-version',
    label: 'Raspberry Pi Version',
    description: 'Raspberry Pi, ROS & vision courses',
    entryPath: '/docs/1. NexArm User Manual.html'
  },
  {
    version: 'jetsonNano',
    label: 'Jetson Nano Version',
    description: 'Jetson Nano, ROS & AI vision courses',
    entryPath: '/'
  }
]

export function getVersionBase(version = defaultVersion) {
  return `/projects/${projectName}/en/${version}/`
}

export function getVersionDefinition(version) {
  return versionDefinitions.find((item) => item.version === version)
}

export function getVersionLabel(version) {
  return getVersionDefinition(version)?.label || version
}

export function getVersionLabels() {
  return Object.fromEntries(versionDefinitions.map((item) => [item.version, item.label]))
}

export function getVersionNames() {
  return versionDefinitions.map((item) => item.version)
}

export function getVersionEntryPath(version = defaultVersion) {
  return getVersionDefinition(version)?.entryPath || '/docs/'
}

export function getVersionUrl(version = defaultVersion, path = '') {
  const base = getVersionBase(version)
  const normalizedPath = String(path).replace(/^\/+/, '')
  return encodeURI(`${base}${normalizedPath}`)
}

// Customer-facing versions shared by the dialog and navigation menu.
export function getSelectableVersions() {
  return versionDefinitions.filter((item) => item.selectable !== false)
}

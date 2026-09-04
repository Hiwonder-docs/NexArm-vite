export const projectName = 'NexArm'
export const defaultVersion = 'latest'

export const versionDefinitions = [
  {
    version: 'latest',
    label: 'Latest'
  },
  {
    version: 'esp32-version',
    label: 'ESP32 Version'
  },
  {
    version: 'imitation-learning-version',
    label: 'Imitation Learning Version'
  },
  {
    version: 'ros-version',
    label: 'ROS Version'
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

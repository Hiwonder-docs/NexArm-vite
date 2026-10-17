<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { getSelectableVersions } from '../site.config.mjs'

const versions = getSelectableVersions().map((version) => ({
  id: version.version,
  name: version.label,
  description: version.description,
  entry: version.entryPath.replace(/^\/+/, '')
}))

const props = defineProps<{ screenMenu?: boolean }>()
const { site } = useData()
const route = useRoute()
const root = ref<HTMLElement | null>(null)
const open = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const versionRoot = computed(() => site.value.base.replace(/\/[^/]+\/$/, ''))
const current = computed(() => versions.find(({ id }) =>
  route.path.includes(`/en/${id}/`)
) || versions.find(({ id }) => site.value.base.includes(`/en/${id}/`)))
const menuId = computed(() => `version-switcher-${props.screenMenu ? 'mobile' : 'desktop'}`)

function versionHref(version: string) {
  const target = versions.find(({ id }) => id === version)!
  return `${versionRoot.value}/${target.id}/${target.entry}`
}

function selectVersion(event: MouseEvent, version: string) {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  open.value = false
  // Each version has its own VitePress bundle and must load its own site data.
  if (version !== current.value?.id) window.location.assign(versionHref(version))
}

function closeOutside(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    open.value = false
    trigger.value?.focus()
  }
}

watch(() => route.path, () => { open.value = false })
onMounted(() => {
  document.addEventListener('click', closeOutside)
  document.addEventListener('keydown', closeOnEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeOutside)
  document.removeEventListener('keydown', closeOnEscape)
})
</script>

<template>
  <ul ref="root" class="version-switcher-list" :class="{ 'is-mobile': screenMenu }">
    <li class="version-switcher">
      <span class="version-switcher__label">Version</span>
      <button
        ref="trigger"
        type="button"
        class="version-switcher__trigger"
        :aria-controls="menuId"
        :aria-expanded="open"
        :aria-label="`Version: ${current?.name || 'Select version'}`"
        @click="open = !open"
      >
        <span class="version-switcher__name">{{ current?.name || 'Select version' }}</span>
        <span class="vpi-chevron-down" aria-hidden="true" />
      </button>
      <ul v-show="open" :id="menuId" class="version-switcher__menu">
        <li
          v-for="version in versions"
          :key="version.id"
          class="version-switcher__item"
          :class="{ 'is-selected': version.id === current?.id }"
          :data-version="version.id"
        >
          <a
            :href="versionHref(version.id)"
            :aria-current="version.id === current?.id ? 'true' : undefined"
            @click.stop="selectVersion($event, version.id)"
          >{{ version.name }}</a>
        </li>
      </ul>
    </li>
  </ul>
</template>

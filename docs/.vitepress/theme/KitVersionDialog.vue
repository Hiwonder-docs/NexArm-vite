<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import { getSelectableVersions } from '../site.config.mjs'

const versions = getSelectableVersions().map((version) => ({
  id: version.version,
  name: version.label,
  description: version.description,
  entry: version.entryPath.replace(/^\/+/, '')
}))

const { site } = useData()
const dialog = ref<HTMLDialogElement | null>(null)
const selected = ref(versions[0]?.id || '')
const versionRoot = computed(() => site.value.base.replace(/\/[^/]+\/$/, ''))
const sessionKey = computed(() => `kit-version-dialog:${versionRoot.value}`)
let previousOverflow: string | null = null

function restoreScroll() {
  if (previousOverflow === null) return
  document.documentElement.style.overflow = previousOverflow
  previousOverflow = null
}

function open() {
  if (!dialog.value || dialog.value.open) return
  dialog.value.showModal()
  previousOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
}

function handleClose() {
  restoreScroll()
}

function confirmVersion() {
  const version = versions.find((item) => item.id === selected.value)
  if (!version) return
  try {
    window.sessionStorage.setItem(sessionKey.value, version.id)
  } catch {
    // Selection still works when browser storage is unavailable.
  }
  dialog.value?.close()
  handleClose()
  if (site.value.base === `${versionRoot.value}/${version.id}/`) return
  // Versions have independent VitePress bundles and need a full page load.
  window.location.assign(`${versionRoot.value}/${version.id}/${version.entry}`)
}

onMounted(() => {
  let savedVersion: string | null = null
  try {
    savedVersion = window.sessionStorage.getItem(sessionKey.value)
  } catch {
    // Show the first-visit prompt even if storage is unavailable.
  }
  if (versions.some((version) => version.id === savedVersion)) {
    selected.value = savedVersion!
  } else {
    open()
  }
})

onBeforeUnmount(restoreScroll)
defineExpose({ open })
</script>

<template>
  <dialog
    ref="dialog"
    class="kit-version-dialog"
    aria-modal="true"
    aria-labelledby="kit-version-dialog-title"
    aria-describedby="kit-version-dialog-description"
    closedby="none"
    @cancel.prevent
    @close="handleClose"
  >
    <h2 id="kit-version-dialog-title" class="kit-version-dialog__title">Choose your NexArm version</h2>
    <p id="kit-version-dialog-description" class="kit-version-dialog__description">
      Select the version for your kit. You can switch versions anytime using the Version menu in the navigation bar.
    </p>
    <form @submit.prevent="confirmVersion">
      <fieldset class="kit-version-dialog__options">
        <legend class="kit-version-dialog__legend">Kit version</legend>
        <label
          v-for="version in versions"
          :key="version.id"
          class="kit-version-dialog__option"
          :class="{ 'is-selected': selected === version.id }"
        >
          <input v-model="selected" type="radio" name="kit-version" :value="version.id">
          <strong>{{ version.name }}</strong>
          <span>{{ version.description }}</span>
        </label>
      </fieldset>
      <button class="kit-version-dialog__confirm" type="submit">Enter selected version <span aria-hidden="true">→</span></button>
    </form>
  </dialog>
</template>

<style scoped>
.kit-version-dialog {
  position: fixed;
  inset: 0;
  box-sizing: border-box;
  width: min(600px, calc(100vw - 32px));
  max-width: none;
  max-height: calc(100dvh - 32px);
  margin: auto;
  padding: 32px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 24px 80px #0003;
}

.kit-version-dialog::backdrop {
  background: #242b3299;
  backdrop-filter: blur(4px);
}

.kit-version-dialog__title {
  margin: 0 0 10px;
  padding: 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 25px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.4;
}

.kit-version-dialog__description {
  margin: 0 0 24px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.kit-version-dialog__options {
  display: grid;
  gap: 10px;
  min-width: 0;
  margin: 0 0 24px;
  padding: 0;
  border: 0;
}

.kit-version-dialog__legend,
.kit-version-dialog__option input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.kit-version-dialog__option {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 56px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
}

.kit-version-dialog__option.is-selected {
  border-color: #ff8b25;
  background: color-mix(in srgb, #ff8b25 9%, var(--vp-c-bg));
  box-shadow: 0 0 0 2px #ff8b2514;
}

.kit-version-dialog__option strong { font-size: 15px; }
.kit-version-dialog__option > span { color: var(--vp-c-text-2); font-size: 13px; text-align: right; line-height: 1.5; }

.kit-version-dialog__confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: 50px;
  padding: 12px 16px;
  border-radius: 9px;
  background: #ff9d28;
  color: #422100;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.kit-version-dialog__confirm:hover { background: #ffae4f; }
.kit-version-dialog__option:focus-within,
.kit-version-dialog__confirm:focus-visible { outline: 3px solid #b45b00; outline-offset: 3px; }

@media (max-width: 480px) {
  .kit-version-dialog { padding: 28px 20px 22px; }
  .kit-version-dialog__title { font-size: 21px; }
  .kit-version-dialog__option { align-items: flex-start; flex-direction: column; gap: 4px; }
  .kit-version-dialog__option > span { text-align: left; }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import KitVersionDialog from './KitVersionDialog.vue'
import { getSelectableVersions } from '../site.config.mjs'
const versionNames = getSelectableVersions().map(({ label }) => label).join(' / ')
const versionDialog = ref<InstanceType<typeof KitVersionDialog> | null>(null)
</script>

<template>
  <section class="kit-version-guide" aria-labelledby="kit-version-title">
    <span class="kit-version-guide__badge">START HERE</span>
    <h2 id="kit-version-title">Choose your NexArm version</h2>
    <p>Select the version for your NexArm to open its setup instructions and tutorials.</p>
    <button type="button" @click="versionDialog?.open()">Choose version <span aria-hidden="true">&rarr;</span></button>
    <p class="kit-version-guide__hint">{{ versionNames }}</p>
    <p class="kit-version-guide__hint">You can also switch versions anytime using the <strong>Version</strong> menu in the navigation bar.</p>
    <KitVersionDialog ref="versionDialog" />
  </section>
</template>

<style scoped>
.kit-version-guide {
  margin: 24px 0;
  padding: 28px;
  border: 2px solid #f29a28;
  border-radius: 16px;
  background: color-mix(in srgb, #ff9d28 7%, var(--vp-c-bg));
}
.kit-version-guide__badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  background: #ffdfb5;
  color: #783b00;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.09em;
}
.kit-version-guide h2 { margin: 14px 0 8px; padding: 0; border: 0; font-size: 26px; line-height: 1.3; }
.kit-version-guide p { margin: 0 0 20px; color: var(--vp-c-text-2); line-height: 1.7; }
.kit-version-guide button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  min-height: 52px;
  padding: 12px 20px;
  border-radius: 9px;
  background: #ff9d28;
  color: #422100;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}
.kit-version-guide button:hover { background: #ffae4f; }
.kit-version-guide button:focus-visible { outline: 3px solid #b45b00; outline-offset: 3px; }
.kit-version-guide .kit-version-guide__hint { margin: 16px 0 0; font-size: 13px; }
@media (max-width: 640px) {
  .kit-version-guide { padding: 20px; }
  .kit-version-guide h2 { font-size: 23px; }
}
</style>

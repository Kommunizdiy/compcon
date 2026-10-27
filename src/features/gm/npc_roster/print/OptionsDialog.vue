<template>
  <print-options-base
    :options="options"
    :include-groups="includeGroups"
    :extra-options="extraOptions"
  />
  <v-card-text class="flavor-text pt-0">
    <fieldset class="pa-2 feature-scale">
      <legend class="clipped-small heading h3">{{ $t('gm.print.featureFontSize') }}&emsp;</legend>
      <div class="d-flex align-center justify-center ga-3 py-2">
        <v-btn
          icon="mdi-minus"
          variant="tonal"
          :disabled="scale <= FEATURE_SCALE_MIN"
          @click="setScale(scale - FEATURE_SCALE_STEP)"
        />
        <v-text-field
          :model-value="scale"
          type="number"
          suffix="%"
          density="compact"
          variant="outlined"
          hide-details
          style="max-width: 120px"
          class="centered-input"
          @change="onTyped"
          @keyup.enter="onTyped"
        />
        <v-btn
          icon="mdi-plus"
          variant="tonal"
          :disabled="scale >= FEATURE_SCALE_MAX"
          @click="setScale(scale + FEATURE_SCALE_STEP)"
        />
        <v-btn
          variant="text"
          :disabled="scale === 100"
          @click="setScale(100)"
        >
          100%
        </v-btn>
      </div>
    </fieldset>
  </v-card-text>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import PrintOptionsBase from '@/shared/print/PrintOptionsBase.vue'
  import { INCLUDE, EXTRA } from '@/ui/print/options'
  import { useI18n } from 'vue-i18n'
  import {
    FEATURE_SCALE_MAX,
    FEATURE_SCALE_MIN,
    FEATURE_SCALE_STEP,
    clampFeatureScale,
  } from './featureScale'

  const { t } = useI18n()

  const props = defineProps<{ options: Record<string, any> }>()

  const scale = computed(() => props.options.featureScale ?? 100)

  function setScale(n: number) {
    if (!Number.isFinite(n) || n <= 0) return
    props.options.featureScale = clampFeatureScale(n)
  }

  // typed values apply on enter/blur, so partial input like "2" isn't clamped mid-typing
  function onTyped(e: Event) {
    setScale(Number((e.target as HTMLInputElement).value))
  }

  const includeGroups = computed(() => [
    {
      field: 'include',
      legend: t('common.options'),
      items: [
        INCLUDE.image,
        INCLUDE.additionalDetail,
        INCLUDE.clocks,
        INCLUDE.tables,
        INCLUDE.gmNotes,
        INCLUDE.passiveFeatures,
        INCLUDE.groupedStats,
        INCLUDE.hideStatFeatures,
        INCLUDE.appendLined,
        INCLUDE.appendUnlined,
      ],
    },
  ])

  const extraOptions = [EXTRA.tagRef]
</script>

<style scoped>
  .feature-scale {
    border-color: rgb(var(--v-theme-primary));
    border-radius: 2px;
    padding: 4px;
  }

  .feature-scale legend {
    background-color: rgb(var(--v-theme-primary));
    color: #fff;
    padding: 3px 6px;
  }

  .centered-input :deep(input) {
    text-align: center;
  }
</style>

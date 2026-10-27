<template>
  <div class="text-black pa-2">
    <v-row
      dense
      align="start"
    >
      <v-col
        class="mr-4 mt-n2"
        cols="auto"
      >
        <div class="heading h2">
          {{ npc.Name }}
        </div>
        <div v-if="npc.NpcClassController.HasClass">
          <div class="text-caption">
            <v-icon
              :icon="npc.TierIcon"
              class="mt-n1"
            />
            <v-icon
              :icon="npc.Icon"
              class="mt-n1"
            />
            {{ npc.NpcClassController.Class?.Name }}
            <template v-if="grouped && sizeText">
              <cc-slashes class="px-1" />
              {{ $t('stats.size') }} {{ sizeText }}
            </template>
          </div>
        </div>
      </v-col>
      <v-col cols="auto ml-auto">
        <v-chip
          label
          size="small"
          :prepend-icon="npc.TagIcon"
          class="mx-1"
        >
          {{ npc.Tag }}
        </v-chip>

        <v-chip
          v-for="t in npc.NpcTemplateController.Templates"
          :key="t.ID"
          label
          size="small"
          variant="outlined"
          prepend-icon="cc:npc_template"
          class="mx-1"
        >
          {{ t.Name }}
        </v-chip>
      </v-col>
    </v-row>
    <div
      v-if="has(options.include, 'gmNotes')"
      class="text-caption mt-1 pl-3"
    >
      {{ npc.GmDescription }}
    </div>

    <v-row dense>
      <v-col>
        <div class="no-print-break">
          <print-npc-stats-grouped
            v-if="grouped"
            :item="npc"
          />
          <print-npc-stats
            v-else
            :item="npc"
          />
        </div>
        <div
          v-if="npc.Description"
          class="mt-1 pl-3"
          v-html-safe="npc.Description"
        />
      </v-col>
      <v-col
        cols="4"
        v-if="has(options.include, 'image')"
      >
        <div
          class="no-print-break"
          :style="`background-image: url('${npc.Portrait}');`"
          style="height: 300px; width: 100%; background-position: top 0%; background-size: cover"
        />
      </v-col>
    </v-row>

    <fieldset class="mx-1 pa-1">
      <legend
        class="text-overline text-primary px-1"
        style="line-height: 14px; border: 1px solid grey; border-radius: 3px"
      >
        {{ $t('common.features') }}
      </legend>
      <div :style="{ zoom: featureZoom }">
        <div
          v-for="f in shownFeatures"
          :key="f.ID"
          class="mt-1 pl-3 caption no-print-break feature-entry"
        >
          <v-btn
            class="d-print-none feature-hide-btn"
            icon="mdi-eye-off-outline"
            size="x-small"
            variant="text"
            density="comfortable"
            :title="$t('gm.print.hideFeature')"
            @click="setFeatureHidden(npc.ID, f.ID, true)"
          />
          <npc-feature-print
            :feature="f"
            :tier="npc.NpcClassController.Tier"
            :owner="npc"
            :mods="npc.NpcFeatureController.GetModifiers(f)"
          />
          <v-divider class="mt-1" />
        </div>
      </div>
      <div
        v-if="manuallyHidden.length"
        class="d-print-none text-caption text-grey-darken-1 pl-3 pt-1"
      >
        {{ $t('gm.print.hiddenFeatures') }}:
        <v-chip
          v-for="f in manuallyHidden"
          :key="`hidden-${f.ID}`"
          size="x-small"
          class="mr-1"
          closable
          @click:close="setFeatureHidden(npc.ID, f.ID, false)"
        >
          {{ f.Name }}
        </v-chip>
        <v-btn
          size="x-small"
          variant="text"
          @click="unhideAllForNpc(npc.ID)"
        >
          {{ $t('gm.print.showAll') }}
        </v-btn>
      </div>
    </fieldset>

    <div
      v-if="has(options.include, 'gmNotes') && npc.Note.length"
      class="mb-1 mt-3 no-print-break"
    >
      <div
        class="text-overline text-primary"
        style="line-height: 0"
      >
        {{ $t('gm.gmNotes') }}
      </div>
      <div
        v-html-safe="npc.Note"
        class="mt-1 pl-3 caption"
      />
    </div>
  </div>

  <npc-narrative-print-section
    :npc="npc"
    :options="options"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { has } from '@/ui/print/options'
  import type { GmPrintOptions } from '@/ui/print/types'
  import type { Unit } from '@/classes/npc/unit/Unit'
  import NpcFeaturePrint from './components/NpcFeaturePrint.vue'
  import { NpcFeatureType } from '@/classes/npc/feature/NpcFeature'
  import type { NpcFeature } from '@/classes/npc/feature/NpcFeature'
  import PrintNpcStats from './components/PrintNpcStats.vue'
  import PrintNpcStatsGrouped from './components/PrintNpcStatsGrouped.vue'
  import NpcNarrativePrintSection from './components/NpcNarrativePrintSection.vue'
  import { isFeatureHidden, setFeatureHidden, unhideAllForNpc } from '../hiddenFeatures'

  defineOptions({ name: 'UnitPrint' })

  const props = defineProps<{
    npc: Unit
    options: GmPrintOptions
  }>()

  const featureZoom = computed(() => (props.options.featureScale ?? 100) / 100)

  const grouped = computed(() => has(props.options.include, 'groupedStats'))

  const sizeText = computed(() => {
    const size = Number(props.npc.StatController.getMaxWithBonuses('size'))
    if (!size) return ''
    return size === 0.5 ? '½' : String(size)
  })

  // mirrors the builder's passive toggle (features.vue), which defaults to showing them
  // mods render nested under the feature they modify, so they are not listed on their own
  // a trait whose whole effect is stat bonuses (e.g. Reinforced: +1 Structure/Stress)
  // is already reflected in the stat block
  function isStatOnly(f: NpcFeature): boolean {
    return f.IsCombatPassive && (f.Bonuses?.length ?? 0) > 0 && !f.Trigger
  }

  const candidates = computed(() =>
    props.npc.NpcFeatureController.Features.filter(f => !!f && !f.Mod)
  )

  const manuallyHidden = computed(() =>
    candidates.value.filter(f => isFeatureHidden(props.npc.ID, f.ID))
  )

  const shownFeatures = computed(() => {
    const hideStat = has(props.options.include, 'hideStatFeatures')
    const all = candidates.value.filter(
      f => !isFeatureHidden(props.npc.ID, f.ID) && !(hideStat && isStatOnly(f))
    )
    const shown = has(props.options.include, 'passiveFeatures') ? all : all.filter(f => !f.Passive)
    // attacks first: weapons, then other features that make an attack roll; order otherwise kept
    const rank = (f: NpcFeature) =>
      f.FeatureType === NpcFeatureType.Weapon ? 0 : f.HasAttackBonus ? 1 : 2
    return shown
      .map((f, i) => ({ f, i }))
      .sort((a, b) => rank(a.f) - rank(b.f) || a.i - b.i)
      .map(x => x.f)
  })
</script>

<style scoped>
  .feature-entry {
    position: relative;
  }

  .feature-hide-btn {
    position: absolute;
    left: -20px;
    top: 0;
    opacity: 0.35;
  }

  .feature-hide-btn:hover {
    opacity: 1;
  }
</style>

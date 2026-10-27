<template>
  <div class="gs no-print-break">
    <div class="gs-row">
      <!-- defenses: the most-read group -->
      <fieldset
        v-if="has('evasion') || has('edef') || has('armor')"
        class="gs-group gs-defense"
      >
        <legend>{{ $t('gm.print.statGroups.defense') }}</legend>
        <div class="gs-cells">
          <div
            v-if="has('evasion') || has('edef')"
            class="gs-tiles"
          >
            <div
              v-if="has('evasion')"
              class="gs-tile gs-tile-solid"
            >
              <div class="gs-line">
                <v-icon
                  :icon="icon('evasion')"
                  size="20"
                  class="gs-icon"
                />
                <span class="gs-num gs-num-xl">{{ raw('evasion') }}</span>
              </div>
              <div class="gs-label">{{ $t('stats.evasion') }}</div>
            </div>
            <div
              v-if="has('edef')"
              class="gs-tile gs-tile-dashed"
            >
              <div class="gs-line">
                <v-icon
                  :icon="icon('edef')"
                  size="20"
                  class="gs-icon"
                />
                <span class="gs-num gs-num-xl">{{ raw('edef') }}</span>
              </div>
              <div class="gs-label">{{ $t('stats.edefense') }}</div>
            </div>
          </div>
          <div
            v-if="has('armor')"
            class="gs-cell"
          >
            <div class="gs-shield">
              <v-icon
                icon="mdi-shield-outline"
                size="54"
              />
              <span class="gs-shield-num">{{ raw('armor') }}</span>
            </div>
            <div class="gs-label">{{ $t('stats.armor') }}</div>
          </div>
        </div>
      </fieldset>

      <!-- save / sensors / speed, no title -->
      <fieldset
        v-if="general.length"
        class="gs-group gs-plain"
      >
        <!-- empty legend so the top border lines up with the titled groups -->
        <legend
          class="gs-legend-empty"
          aria-hidden="true"
        >
          &nbsp;
        </legend>
        <div class="gs-cells">
          <div
            v-for="s in general"
            :key="s.key"
            class="gs-cell"
          >
            <div class="gs-line">
              <v-icon
                :icon="icon(s.key)"
                size="18"
                class="gs-icon"
              />
              <span class="gs-num">{{ s.value }}</span>
            </div>
            <div class="gs-label">{{ s.label }}</div>
          </div>
        </div>
      </fieldset>

      <fieldset
        v-if="temporary.length"
        class="gs-group gs-minor"
      >
        <legend>{{ $t('gm.print.statGroups.temporary') }}</legend>
        <div class="gs-list">
          <div
            v-for="s in temporary"
            :key="s.key"
            class="gs-list-item"
          >
            <v-icon
              :icon="icon(s.key)"
              size="14"
              class="gs-icon"
            />
            <span class="gs-label">{{ s.label }}</span>
            <span class="gs-write" />
          </div>
        </div>
      </fieldset>
    </div>

    <div class="gs-row">
      <fieldset
        v-if="has('hp') || heatKey"
        class="gs-group"
      >
        <legend>{{ $t('gm.print.statGroups.durability') }}</legend>
        <div class="gs-cells gs-cells-tight">
          <div
            v-if="has('hp')"
            class="gs-pair"
          >
            <div class="gs-cell">
              <div class="gs-line">
                <v-icon
                  :icon="icon('hp')"
                  size="18"
                  class="gs-icon"
                />
                <span class="gs-num">{{ raw('hp') }}</span>
                <span class="gs-slash">/</span>
                <span class="gs-write" />
              </div>
              <div class="gs-label">{{ $t('stats.hp') }}</div>
            </div>
            <div
              v-if="has('structure') && raw('structure')"
              class="gs-cell"
            >
              <div class="gs-line">
                <span
                  v-for="n in boxes('structure')"
                  :key="`str-${n}`"
                  class="gs-box"
                />
                <span
                  v-if="raw('structure') > MAX_BOXES"
                  class="gs-num gs-num-s"
                >
                  {{ raw('structure') }}
                </span>
              </div>
              <div class="gs-label">{{ $t('stats.structure') }}</div>
            </div>
          </div>

          <div
            v-if="has('hp') && heatKey"
            class="gs-sep"
          />

          <div
            v-if="heatKey"
            class="gs-pair"
          >
            <div class="gs-cell">
              <div class="gs-line">
                <v-icon
                  :icon="icon('heatcap')"
                  size="18"
                  class="gs-icon"
                />
                <span class="gs-num">{{ raw(heatKey) }}</span>
                <span class="gs-slash">/</span>
                <span class="gs-write" />
              </div>
              <div class="gs-label">{{ $t('common.heatCapacity') }}</div>
            </div>
            <div
              v-if="has('stress') && raw('stress')"
              class="gs-cell"
            >
              <div class="gs-line">
                <span
                  v-for="n in boxes('stress')"
                  :key="`stress-${n}`"
                  class="gs-box"
                />
                <span
                  v-if="raw('stress') > MAX_BOXES"
                  class="gs-num gs-num-s"
                >
                  {{ raw('stress') }}
                </span>
              </div>
              <div class="gs-label">{{ $t('stats.stress') }}</div>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset
        v-if="has('activations') && raw('activations')"
        class="gs-group"
      >
        <legend>{{ $t('active.customStatEditor.activations') }}</legend>
        <div class="gs-cells">
          <div class="gs-line">
            <v-icon
              v-for="n in raw('activations')"
              :key="`act-${n}`"
              icon="mdi-hexagon-outline"
              size="24"
            />
          </div>
        </div>
      </fieldset>

      <fieldset
        v-if="attributes.length"
        class="gs-group gs-minor gs-grow"
      >
        <legend>{{ $t('gm.print.statGroups.attributes') }}</legend>
        <div class="gs-cells">
          <div
            v-for="s in attributes"
            :key="s.key"
            class="gs-cell"
          >
            <span class="gs-num gs-num-s">{{ s.value }}</span>
            <div class="gs-label">{{ s.label }}</div>
          </div>
        </div>
      </fieldset>
    </div>

    <div
      v-if="others.length"
      class="gs-row"
    >
      <fieldset class="gs-group gs-minor">
        <legend>{{ $t('gm.print.statGroups.other') }}</legend>
        <div class="gs-cells">
          <div
            v-for="s in others"
            :key="s.key"
            class="gs-cell"
          >
            <span class="gs-num gs-num-s">{{ s.value }}</span>
            <div class="gs-label">{{ s.label }}</div>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { StatController } from '@/classes/components/combat/stats/StatController'
  import { Stats } from '@/classes/components/combat/stats/Stats'

  defineOptions({ name: 'npc-stat-print-grouped' })

  const props = defineProps<{
    item: { StatController: StatController }
  }>()

  const { t } = useI18n()

  // structure/stress above this become a plain number instead of boxes
  const MAX_BOXES = 6

  const sc = computed(() => props.item.StatController)
  const present = computed(() => new Set(sc.value.DisplayKeys.map(x => x.key)))

  function raw(key: string): number {
    return Number(sc.value.getMaxWithBonuses(key)) || 0
  }

  function has(key: string): boolean {
    return present.value.has(key)
  }

  function icon(key: string): string {
    return Stats.IconMap[key] || 'mdi-circle-small'
  }

  function boxes(key: string): number {
    const n = raw(key)
    return n > MAX_BOXES ? 0 : n
  }

  function signed(n: number): string {
    return n > 0 ? `+${n}` : String(n)
  }

  const general = computed(() =>
    [
      { key: 'saveTarget', label: t('common.saveTarget') },
      { key: 'sensorRange', label: t('stats.sensors') },
      { key: 'speed', label: t('stats.speed') },
    ]
      .filter(s => has(s.key))
      .map(s => ({ ...s, value: raw(s.key) }))
  )

  // NPCs keep heat capacity under `heat`, some stat blocks under `heatcap`
  const heatKey = computed(() => {
    if (has('heat') && raw('heat')) return 'heat'
    if (has('heatcap') && raw('heatcap')) return 'heatcap'
    return null
  })

  const temporary = computed(() =>
    [
      { key: 'overshield', label: t('common.overshield') },
      { key: 'burn', label: t('common.burnStatus') },
    ].filter(s => has(s.key))
  )

  const attributes = computed(() =>
    [
      { key: 'hull', label: t('stats.hull') },
      { key: 'agi', label: t('stats.agility') },
      { key: 'sys', label: t('stats.systems') },
      { key: 'eng', label: t('stats.engineering') },
    ]
      .filter(s => has(s.key))
      .map(s => ({ ...s, value: signed(raw(s.key)) }))
  )

  // size is printed in the header next to tier and class
  const GROUPED = new Set([
    'evasion',
    'edef',
    'armor',
    'saveTarget',
    'sensorRange',
    'speed',
    'hp',
    'structure',
    'heat',
    'heatcap',
    'stress',
    'activations',
    'overshield',
    'burn',
    'hull',
    'agi',
    'sys',
    'eng',
    'size',
    'sizes',
    'overcharge',
  ])

  // custom or uncommon stats (tech attack, repair capacity, user-added) that have a value
  const others = computed(() =>
    sc.value.DisplayKeys.filter(x => !GROUPED.has(x.key) && raw(x.key) !== 0)
      .sort((a, b) => a.sort - b.sort)
      .map(x => ({
        key: x.key,
        label:
          x.key === 'techAttack'
            ? t('stats.techAttack')
            : x.key === 'repairCapacity'
              ? t('stats.repCap')
              : x.key === 'attackBonus'
                ? t('common.attackBonus')
                : x.title,
        value: ['techAttack', 'attackBonus'].includes(x.key) ? signed(raw(x.key)) : raw(x.key),
      }))
  )
</script>

<style scoped>
  .gs {
    margin: 4px 0;
    color: black;
  }

  .gs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 6px;
    margin-bottom: 5px;
  }

  .gs-group {
    border: 1px solid rgba(0, 0, 0, 0.45) !important;
    border-radius: 4px;
    padding: 0 10px 5px !important;
    height: auto !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .gs-group legend {
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
    padding: 0 4px;
  }

  .gs-defense {
    border: 2px solid black !important;
  }

  .gs-defense legend {
    font-size: 10pt;
  }

  .gs-plain {
    flex: 1 1 auto;
    border-color: rgba(0, 0, 0, 0.25) !important;
  }

  .gs-group legend.gs-legend-empty {
    padding: 0;
    width: 0;
    overflow: hidden;
  }

  .gs-minor legend {
    color: rgba(0, 0, 0, 0.6);
  }

  .gs-grow {
    flex: 1 1 auto;
  }

  .gs-cells {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 16px;
    height: 100%;
  }

  .gs-cells-tight {
    gap: 12px;
  }

  .gs-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .gs-line {
    display: flex;
    align-items: baseline;
    white-space: nowrap;
  }

  .gs-icon {
    align-self: center;
    margin-right: 3px;
    color: rgba(0, 0, 0, 0.75);
  }

  .gs-num {
    font-size: 20pt;
    font-weight: 700;
    line-height: 1;
  }

  .gs-num-xl {
    font-size: 28pt;
  }

  .gs-num-s {
    font-size: 13pt;
  }

  .gs-label {
    font-size: 8pt;
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: rgba(0, 0, 0, 0.72);
    white-space: nowrap;
    margin-top: 2px;
  }

  .gs-tile {
    min-width: 100px;
    padding: 2px 8px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .gs-tiles {
    display: flex;
    align-items: stretch;
  }

  .gs-tile-solid {
    border: 2px solid black;
  }

  .gs-tile-dashed {
    border: 2px dashed black;
  }

  /* evasion and e-def share one edge so they read as a pair */
  .gs-tiles .gs-tile:first-child:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .gs-tiles .gs-tile:last-child:not(:first-child) {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .gs-shield {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
  }

  .gs-shield-num {
    position: absolute;
    font-size: 17pt;
    font-weight: 700;
    line-height: 1;
    margin-top: -3px;
  }

  .gs-pair {
    display: flex;
    align-items: flex-end;
    gap: 10px;
  }

  .gs-sep {
    width: 1px;
    align-self: stretch;
    background: rgba(0, 0, 0, 0.25);
  }

  .gs-slash {
    font-size: 14pt;
    margin: 0 1px 0 3px;
  }

  .gs-write {
    display: inline-block;
    width: 30px;
    border-bottom: 1.5px solid black;
    margin-left: 3px;
  }

  .gs-box {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1.5px solid black;
    border-radius: 2px;
    margin: 0 1px 3px;
  }

  .gs-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    height: 100%;
    padding-top: 2px;
  }

  .gs-list-item {
    display: flex;
    align-items: baseline;
  }

  .gs-list-item .gs-icon {
    align-self: auto;
  }

  .gs-list-item .gs-write {
    height: 12px;
    margin-left: 5px;
  }
</style>

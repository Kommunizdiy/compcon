import { ref } from 'vue'

// features the GM hid by hand on NPC print, keyed "<npcId>:<featureId>"; remembered between visits
const STORAGE_KEY = 'cc-npc-print-hidden-features'

function load(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (Array.isArray(raw)) return new Set(raw.filter(x => typeof x === 'string'))
  } catch {
    // storage unavailable or corrupt
  }
  return new Set()
}

const hidden = ref<Set<string>>(load())

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...hidden.value]))
  } catch {
    // ignore
  }
}

function key(npcId: string, featureId: string) {
  return `${npcId}:${featureId}`
}

export function isFeatureHidden(npcId: string, featureId: string): boolean {
  return hidden.value.has(key(npcId, featureId))
}

export function setFeatureHidden(npcId: string, featureId: string, value: boolean) {
  const next = new Set(hidden.value)
  if (value) next.add(key(npcId, featureId))
  else next.delete(key(npcId, featureId))
  hidden.value = next
  persist()
}

export function unhideAllForNpc(npcId: string) {
  hidden.value = new Set([...hidden.value].filter(k => !k.startsWith(`${npcId}:`)))
  persist()
}

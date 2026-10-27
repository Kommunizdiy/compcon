// font size of the Features block on NPC print, in percent; remembered between visits
const STORAGE_KEY = 'cc-npc-print-feature-scale'

export const FEATURE_SCALE_MIN = 50
export const FEATURE_SCALE_MAX = 400
export const FEATURE_SCALE_STEP = 10

export function clampFeatureScale(n: number): number {
  if (!Number.isFinite(n)) return 100
  return Math.min(FEATURE_SCALE_MAX, Math.max(FEATURE_SCALE_MIN, Math.round(n)))
}

export function loadFeatureScale(): number {
  try {
    const v = Number(localStorage.getItem(STORAGE_KEY))
    if (v) return clampFeatureScale(v)
  } catch {
    // storage unavailable
  }
  return 100
}

export function saveFeatureScale(n: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(clampFeatureScale(n)))
  } catch {
    // ignore
  }
}

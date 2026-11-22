const STORAGE_KEY = 'skillmap-v1'

export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Unable to load SkillMap data from LocalStorage.', error)
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Unable to save SkillMap data to LocalStorage.', error)
    window.dispatchEvent(new CustomEvent('skillmap:storage-error'))
  }
}

export const clearState = () => localStorage.removeItem(STORAGE_KEY)

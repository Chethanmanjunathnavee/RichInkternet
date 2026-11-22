import { useCallback, useEffect, useMemo, useState } from 'react'
import { careers, getCareer } from '../data/roadmaps'
import { loadState, saveState, clearState } from '../utils/storage'
import { AppContext } from './SkillMapContext'
const freshState = () => ({
  selectedCareer: 'frontend',
  completed: {},
  customRoadmaps: [],
  profile: { name: 'Alex Morgan', email: 'alex.morgan@email.com', goal: 'Land my first developer role' },
  theme: 'light',
  activity: [],
  streak: 0,
})

function getStreak(activities, referenceDate) {
  const dayStart = (date) => {
    const value = new Date(date)
    value.setHours(0, 0, 0, 0)
    return value.getTime()
  }
  const activeDays = new Set(activities.map((activity) => dayStart(activity.date)))
  let cursor = dayStart(referenceDate)
  const previousDay = (timestamp) => {
    const date = new Date(timestamp)
    date.setDate(date.getDate() - 1)
    return date.getTime()
  }
  if (!activeDays.has(cursor)) cursor = previousDay(cursor)
  let count = 0
  while (activeDays.has(cursor)) {
    count += 1
    cursor = previousDay(cursor)
  }
  return count
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    const restored = { ...freshState(), ...(loadState() || {}) }
    return { ...restored, streak: getStreak(restored.activity || [], new Date()) }
  })

  useEffect(() => { saveState(state) }, [state])
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
  }, [state.theme])

  const selectCareer = useCallback((careerId) => {
    if (!careers.some((career) => career.id === careerId)) return
    setState((current) => ({ ...current, selectedCareer: careerId }))
  }, [])

  const completeTopic = useCallback((careerId, topicId) => {
    const career = getCareer(careerId)
    const index = career.topics.findIndex((topic) => topic.id === topicId)
    if (index < 0) return false
    const topic = career.topics[index]
    const prerequisites = topic.prerequisites ?? (index > 0 ? [career.topics[index - 1].id] : [])
    const currentCompleted = state.completed[careerId] || []
    if (currentCompleted.includes(topicId) || !prerequisites.every((id) => currentCompleted.includes(id))) return false
    const date = new Date()
    const activityItem = { id: `${date.getTime()}`, text: `Completed ${career.topics[index].title}`, career: career.title, date: date.toISOString() }
    setState((current) => {
      const activity = [activityItem, ...current.activity]
      return {
        ...current,
        completed: { ...current.completed, [careerId]: [...(current.completed[careerId] || []), topicId] },
        activity,
        streak: getStreak(activity, date),
      }
    })
    return true
  }, [state.completed])

  const updateProfile = useCallback((profile) => setState((current) => ({ ...current, profile: { ...current.profile, ...profile } })), [])
  const updateTheme = useCallback((theme) => setState((current) => ({ ...current, theme })), [])
  const addCustomRoadmap = useCallback((roadmap) => setState((current) => ({ ...current, customRoadmaps: [...current.customRoadmaps, { ...roadmap, id: roadmap.id || `custom-${Date.now()}` }] })), [])
  const updateCustomRoadmap = useCallback((id, patch) => setState((current) => ({ ...current, customRoadmaps: current.customRoadmaps.map((roadmap) => roadmap.id === id ? { ...roadmap, ...patch } : roadmap) })), [])
  const deleteCustomRoadmap = useCallback((id) => setState((current) => ({ ...current, customRoadmaps: current.customRoadmaps.filter((roadmap) => roadmap.id !== id) })), [])
  const resetProgress = useCallback(() => setState((current) => ({ ...current, completed: {}, activity: [], streak: 0 })), [])
  const resetAll = useCallback(() => { clearState(); setState(freshState()) }, [])
  const importData = useCallback((data) => {
    const validProfile = data?.profile && typeof data.profile.name === 'string' && typeof data.profile.email === 'string'
    const validRoadmaps = Array.isArray(data?.customRoadmaps) && data.customRoadmaps.every((roadmap) =>
      typeof roadmap.title === 'string' && Array.isArray(roadmap.topics) &&
      roadmap.topics.every((topic) => typeof topic.id === 'string' && typeof topic.title === 'string'),
    )
    const validProgress = data?.completed && typeof data.completed === 'object' && !Array.isArray(data.completed) &&
      Object.values(data.completed).every((topics) => Array.isArray(topics))
    if (!data || typeof data !== 'object' || !validProfile || !validRoadmaps || !validProgress ||
      !Array.isArray(data.activity) || (data.theme !== 'light' && data.theme !== 'dark')) {
      throw new Error('This file does not look like a valid SkillMap backup.')
    }
    setState({ ...freshState(), ...data })
  }, [])

  const value = useMemo(() => ({
    ...state,
    currentCareer: getCareer(state.selectedCareer),
    completedFor: (careerId) => state.completed[careerId] || [],
    selectCareer, completeTopic, updateProfile, updateTheme,
    addCustomRoadmap, updateCustomRoadmap, deleteCustomRoadmap, resetProgress, resetAll, importData,
  }), [state, selectCareer, completeTopic, updateProfile, updateTheme, addCustomRoadmap, updateCustomRoadmap, deleteCustomRoadmap, resetProgress, resetAll, importData])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}


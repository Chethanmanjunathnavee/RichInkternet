import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppLayout from './components/AppLayout'

const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Careers = lazy(() => import('./pages/Careers'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const TopicDetails = lazy(() => import('./pages/TopicDetails'))
const Analytics = lazy(() => import('./pages/Analytics'))
const CustomRoadmaps = lazy(() => import('./pages/CustomRoadmaps'))
const Settings = lazy(() => import('./pages/Settings'))

export default function App() {
  return <AppProvider><BrowserRouter><Suspense fallback={<div className="app-loading"><span className="loading-mark">s.</span><span>Opening your learning space…</span></div>}><Routes>
    <Route path="/" element={<Landing />} />
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/topic/:topicId" element={<TopicDetails />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/custom" element={<CustomRoadmaps />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  </Routes></Suspense></BrowserRouter></AppProvider>
}

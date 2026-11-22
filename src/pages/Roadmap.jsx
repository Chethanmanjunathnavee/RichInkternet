import { useMemo } from 'react'
import { ArrowRight, Check, Clock3, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RoadmapCanvas from '../components/RoadmapCanvas'
import ProgressRing from '../components/ProgressRing'
import { useApp } from '../hooks/useApp'

export default function Roadmap() {
  const { currentCareer, completedFor } = useApp()
  const navigate = useNavigate()
  const completed = completedFor(currentCareer.id)
  const percent = Math.round(completed.length / currentCareer.topics.length * 100)
  const next = useMemo(() => currentCareer.topics.find((topic, index) => {
    const prerequisites = topic.prerequisites ?? (index > 0 ? [currentCareer.topics[index - 1].id] : [])
    return !completed.includes(topic.id) && prerequisites.every((id) => completed.includes(id))
  }), [currentCareer, completed])
  return <div className="roadmap-page">
    <div className="roadmap-heading"><div><span className="section-kicker">YOUR PERSONAL LEARNING JOURNEY</span><h1>{currentCareer.title}</h1><p>{currentCareer.description}</p></div><div className="roadmap-progress-pill"><ProgressRing value={percent} size={48} stroke={5} /><span><strong>{completed.length} of {currentCareer.topics.length}</strong><small>steps complete</small></span></div></div>
    <div className="roadmap-callout"><span className="callout-spark"><Sparkles size={16} /></span><div><strong>Every expert started somewhere.</strong><span>Follow the path at your own pace. Click a step to explore it.</span></div><button onClick={() => navigate(`/topic/${next?.id || currentCareer.topics[0].id}`)} className="text-link">Start next step <ArrowRight size={15} /></button></div>
    <div className="roadmap-canvas-card card-surface"><div className="canvas-heading"><div><h3>Your visual roadmap</h3><p>Drag to pan · scroll to zoom · click a topic to see details</p></div><div className="canvas-progress-label"><span>{percent}%</span><div className="mini-progress"><i style={{ width: `${percent}%` }} /></div></div></div><RoadmapCanvas career={currentCareer} completed={completed} onSelectTopic={(id) => navigate(`/topic/${id}`)} /></div>
    <div className="roadmap-bottom-stats"><div><span className="roadmap-stat-icon"><Clock3 size={16} /></span><span><strong>{currentCareer.duration}</strong><small>estimated learning journey</small></span></div><div><span className="roadmap-stat-icon green"><Check size={16} /></span><span><strong>{completed.length} milestones reached</strong><small>you’re building real momentum</small></span></div><button className="button button-outline" onClick={() => navigate('/analytics')}>View your progress <ArrowRight size={15} /></button></div>
  </div>
}

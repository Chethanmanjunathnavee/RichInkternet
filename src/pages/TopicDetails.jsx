import { ArrowLeft, ArrowRight, BookOpen, Check, CircleHelp, Clock3, ExternalLink, Lightbulb, LockKeyhole, Play, Sparkles } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { getTopicStatus } from '../data/roadmaps'

export default function TopicDetails() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { currentCareer, completedFor, completeTopic } = useApp()
  const index = currentCareer.topics.findIndex((topic) => topic.id === topicId)
  const topic = currentCareer.topics[index]
  if (!topic) return <div className="empty-state card-surface"><span className="empty-icon"><CircleHelp size={20} /></span><h3>Topic not found</h3><p>This topic isn’t in your current roadmap.</p><Link className="button button-primary" to="/roadmap">Back to roadmap <ArrowRight size={15} /></Link></div>
  const completed = completedFor(currentCareer.id)
  const status = getTopicStatus(currentCareer, completed, index)
  const prerequisiteIds = topic.prerequisites ?? (index > 0 ? [currentCareer.topics[index - 1].id] : [])
  const prerequisites = currentCareer.topics.filter((item) => prerequisiteIds.includes(item.id))
  const locked = status === 'locked'
  const finish = () => {
    if (completeTopic(currentCareer.id, topic.id)) navigate('/roadmap')
  }
  return <div className="topic-page">
    <button className="back-link" onClick={() => navigate('/roadmap')}><ArrowLeft size={15} /> Back to your roadmap</button>
    <div className="topic-layout">
      <article className="topic-main card-surface">
        <div className="topic-label-row"><span className={`topic-status-badge ${status}`}><i />{status === 'in-progress' ? 'READY TO START' : status.toUpperCase()}</span><span className="topic-step-count">STEP {String(index + 1).padStart(2, '0')} OF {currentCareer.topics.length}</span></div>
        <div className="topic-hero-icon"><BookOpen size={23} /></div><h1>{topic.title}</h1><p className="topic-description">{topic.description}</p>
        <div className="topic-meta-row"><span><Clock3 size={16} /> About {topic.hours} hours</span><span><Sparkles size={16} /> {currentCareer.title}</span></div>
        {locked && <div className="locked-notice"><LockKeyhole size={17} /><div><strong>This step unlocks as you make progress.</strong><span>Complete the earlier topics in this path to continue.</span></div></div>}
        <div className="detail-section"><h3><span className="detail-heading-icon"><BookOpen size={16} /></span>Learning resources</h3><p>Thoughtful places to start exploring this topic.</p><div className="resource-list">{topic.resources.map((resource) => <a href={resource.url} key={resource.url} target="_blank" rel="noreferrer" className="resource-link"><span className="resource-favicon"><Play size={13} fill="currentColor" /></span><span><strong>{resource.label}</strong><small>{new URL(resource.url).hostname}</small></span><ExternalLink size={15} /></a>)}</div></div>
        <div className="detail-section"><h3><span className="detail-heading-icon exercise"><Lightbulb size={16} /></span>Put it into practice</h3><p>A hands-on exercise to help the ideas stick.</p><div className="exercise-box"><span className="exercise-bullet">01</span><span>{topic.exercise}</span></div><div className="exercise-box project-box"><span className="exercise-bullet">✦</span><span><strong>Mini project idea</strong>{topic.project}</span></div></div>
        <div className="topic-complete-row">{status === 'completed' ? <div className="completed-note"><span><Check size={16} /></span> You’ve completed this topic. Nice work!</div> : <button className="button button-primary button-large" disabled={locked} onClick={finish}>{locked ? <><LockKeyhole size={16} /> Complete prerequisites first</> : <><Check size={16} /> Mark as completed</>}</button>}<span>Your progress is saved automatically.</span></div>
      </article>
      <aside className="topic-sidebar"><div className="sidebar-card card-surface"><span className="section-kicker">YOUR LEARNING PATH</span><h3>{currentCareer.title}</h3><div className="topic-list">{currentCareer.topics.map((item, topicIndex) => {
        const stepStatus = getTopicStatus(currentCareer, completed, topicIndex)
        return <button key={item.id} disabled={stepStatus === 'locked'} className={`topic-list-row ${item.id === topic.id ? 'current' : ''}`} onClick={() => navigate(`/topic/${item.id}`)}><span className={`topic-list-number ${stepStatus}`}>{stepStatus === 'completed' ? <Check size={12} /> : stepStatus === 'locked' ? <LockKeyhole size={11} /> : topicIndex + 1}</span><span>{item.title}</span></button>
      })}</div></div><div className="prereq-card card-surface"><span className="section-kicker">BEFORE THIS STEP</span><h4>Prerequisites</h4>{prerequisites.length ? prerequisites.map((item) => <span key={item.id} className={`prereq-item ${completed.includes(item.id) ? 'done' : ''}`}><Check size={13} />{item.title}</span>) : <p>No prerequisites. You’re good to go!</p>}</div></aside>
    </div>
  </div>
}

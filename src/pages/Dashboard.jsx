import { ArrowRight, BookOpen, Check, ChevronRight, Clock3, Flame, MoreHorizontal, Play, Sparkles, Target, TrendingUp } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { getTopicStatus } from '../data/roadmaps'
import ProgressRing from '../components/ProgressRing'

export default function Dashboard() {
  const { currentCareer, completedFor, profile, streak, activity } = useApp()
  const navigate = useNavigate()
  const done = completedFor(currentCareer.id)
  const percent = Math.round(done.length / currentCareer.topics.length * 100)
  const nextIndex = currentCareer.topics.findIndex((_, index) => getTopicStatus(currentCareer, done, index) === 'in-progress')
  const nextTopic = currentCareer.topics[nextIndex < 0 ? 0 : nextIndex]
  const pending = currentCareer.topics.length - done.length
  const recent = (activity || []).slice(0, 3)

  return <div className="dashboard-page">
    <section className="welcome-row"><div><div className="welcome-eyebrow"><Sparkles size={14} /> YOUR LEARNING SPACE</div><h1>Good morning, {profile.name.split(' ')[0]} <span className="wave">✦</span></h1><p>Every small step takes you somewhere. Ready to keep going?</p></div><div className="date-chip"><span className="online-dot" /> Your journey is in motion</div></section>
    <section className="dashboard-hero card-surface">
      <div className="hero-card-copy"><div className="hero-card-label"><span className="hero-card-dot" /> YOUR CURRENT PATH</div><h2>{currentCareer.title}</h2><p>{currentCareer.description}</p><div className="hero-card-meta"><span><Clock3 size={15} /> {currentCareer.duration}</span><span><BookOpen size={15} /> {currentCareer.topics.length} learning steps</span></div><div className="hero-card-actions"><Link className="button button-primary" to="/roadmap">Open my roadmap <ArrowRight size={15} /></Link><button className="button button-outline" onClick={() => navigate('/careers')}>Change path</button></div></div>
      <div className="hero-card-orbit"><div className="orbit-ring orbit-one" /><div className="orbit-ring orbit-two" /><div className="orbit-center"><ProgressRing value={percent} size={118} stroke={8} /><span>path progress</span></div><span className="orbit-dot orbit-dot-a"><Check size={14} /></span><span className="orbit-dot orbit-dot-b"><Sparkles size={14} /></span><span className="orbit-dot orbit-dot-c"><Target size={14} /></span></div>
    </section>
    <section className="stats-grid">
      <article className="stat-card card-surface"><span className="stat-icon purple-bg"><TrendingUp size={18} /></span><div><span className="stat-label">Overall progress</span><strong>{percent}<small>%</small></strong><span className="stat-foot"><span className="tiny-up">↗</span> Keep up the momentum</span></div><div className="stat-watermark">↗</div></article>
      <article className="stat-card card-surface"><span className="stat-icon green-bg"><Check size={18} /></span><div><span className="stat-label">Topics completed</span><strong>{done.length}<small> / {currentCareer.topics.length}</small></strong><span className="stat-foot">One step at a time</span></div><div className="stat-watermark">✓</div></article>
      <article className="stat-card card-surface"><span className="stat-icon orange-bg"><Target size={18} /></span><div><span className="stat-label">Still to explore</span><strong>{pending}<small> topics</small></strong><span className="stat-foot">Your next adventure awaits</span></div><div className="stat-watermark">◎</div></article>
      <article className="stat-card card-surface"><span className="stat-icon pink-bg"><Flame size={18} /></span><div><span className="stat-label">Learning streak</span><strong>{streak}<small> {streak === 1 ? 'day' : 'days'}</small></strong><span className="stat-foot">Little by little adds up</span></div><div className="stat-watermark">✦</div></article>
    </section>
    <section className="dashboard-columns">
      <article className="next-card card-surface"><div className="panel-heading"><div><span className="section-kicker">YOUR NEXT STEP</span><h3>Pick up where you left off</h3></div><button className="icon-btn" aria-label="View all learning activity" title="View your learning activity" onClick={() => navigate('/analytics')}><MoreHorizontal size={19} /></button></div><div className="next-topic"><div className="next-topic-icon"><Play size={18} fill="currentColor" /></div><div className="next-topic-info"><span className="topic-step">STEP {String(Math.max(1, nextIndex + 1)).padStart(2, '0')} <span>·</span> {nextTopic?.hours || 0} HOURS</span><h4>{nextTopic?.title || 'Choose a learning path'}</h4><p>{nextTopic?.description || 'Pick a path to start learning.'}</p></div></div><div className="next-card-footer"><span><span className="online-dot" /> Ready whenever you are</span><button className="button button-primary" onClick={() => navigate(`/topic/${nextTopic?.id || ''}`)}>Continue learning <ArrowRight size={15} /></button></div></article>
      <article className="activity-card card-surface"><div className="panel-heading"><div><span className="section-kicker">YOUR JOURNEY</span><h3>Recent activity</h3></div><Link className="text-link small-link" to="/analytics">See all <ArrowRight size={14} /></Link></div>{recent.length ? <div className="activity-list">{recent.map((item) => <div className="activity-item" key={item.id}><span className="activity-check"><Check size={13} /></span><div><strong>{item.text}</strong><small>{item.career} · {new Date(item.date).toLocaleDateString()}</small></div></div>)}</div> : <div className="activity-empty"><span className="empty-icon"><Sparkles size={18} /></span><strong>Your story starts here</strong><p>Complete a learning step and it’ll show up here.</p></div>}</article>
    </section>
    <section className="career-nudge"><div className="nudge-icon"><Sparkles size={17} /></div><div><strong>A path is just the beginning.</strong><span>Need a different direction? Explore all the skills you could learn next.</span></div><Link className="text-link" to="/careers">Explore paths <ChevronRight size={16} /></Link></section>
  </div>
}

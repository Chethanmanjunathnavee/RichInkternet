import { useMemo, useState } from 'react'
import { Activity, Award, Check, Flame, Sparkles, Target, TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useApp } from '../hooks/useApp'
import { getTopicStatus } from '../data/roadmaps'

const COLORS = ['#7658e8', '#4a90e2', '#22a88a', '#f0a94f', '#df6c87', '#24aab8']

export default function Analytics() {
  const { currentCareer, completedFor, activity, streak } = useApp()
  const [now] = useState(() => Date.now())
  const completed = completedFor(currentCareer.id)
  const total = currentCareer.topics.length
  const percent = Math.round(completed.length / total * 100)
  const statuses = currentCareer.topics.map((_, index) => getTopicStatus(currentCareer, completed, index))
  const countStatus = (status) => statuses.filter((item) => item === status).length
  const skillData = currentCareer.topics.map((topic) => ({ name: topic.title.length > 16 ? `${topic.title.slice(0, 15)}…` : topic.title, progress: completed.includes(topic.id) ? 100 : 0 }))
  const distribution = [
    { name: 'Completed', value: countStatus('completed') },
    { name: 'In progress', value: countStatus('in-progress') },
    { name: 'Upcoming', value: countStatus('upcoming') },
    { name: 'Locked', value: countStatus('locked') },
  ]
  const weekly = useMemo(() => {
    const offsets = [6, 5, 4, 3, 2, 1, 0]
    return offsets.map((offset) => {
      const date = new Date(now)
      date.setDate(date.getDate() - offset)
      const count = (activity || []).filter((item) => new Date(item.date).toDateString() === date.toDateString()).length
      return { day: date.toLocaleDateString('en-US', { weekday: 'short' }), sessions: count }
    })
  }, [activity, now])
  const achievements = [
    { title: 'First steps', detail: 'Complete your first learning topic', unlocked: completed.length >= 1, icon: Check },
    { title: 'Finding a rhythm', detail: 'Complete 3 topics on your path', unlocked: completed.length >= 3, icon: Flame },
    { title: 'Halfway there', detail: 'Reach 50% roadmap progress', unlocked: percent >= 50, icon: Target },
    { title: 'Pathfinder', detail: 'Complete an entire roadmap', unlocked: percent === 100, icon: Award },
  ]
  return <div className="analytics-page">
    <div className="page-intro analytics-intro"><div><span className="section-kicker">A LITTLE PROGRESS GOES A LONG WAY</span><h1>Your progress,<br /><span>in perspective.</span></h1><p>Celebrate what you’ve learned and see how far you’ve come.</p></div><div className="analytics-score card-surface"><div className="score-orb"><TrendingUp size={21} /></div><div><span>OVERALL PROGRESS</span><strong>{percent}%</strong><small>{completed.length} of {total} steps complete</small></div></div></div>
    <div className="analytics-card-grid">
      <article className="chart-card card-surface chart-wide"><div className="chart-heading"><div><span className="section-kicker">YOUR WEEK</span><h3>Learning activity</h3></div><span className="chart-badge"><Activity size={13} /> This week</span></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weekly} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}><defs><linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7658e8" stopOpacity={0.24} /><stop offset="95%" stopColor="#7658e8" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid stroke="var(--chart-grid)" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)' }} /><Area type="monotone" dataKey="sessions" stroke="#7658e8" strokeWidth={2.5} fill="url(#activityFill)" activeDot={{ r: 5 }} /></AreaChart></ResponsiveContainer></div><div className="chart-footer"><span><span className="online-dot" /> Recent completed topics</span><span>{activity?.length || 0} learning moments recorded</span></div></article>
      <article className="chart-card card-surface"><div className="chart-heading"><div><span className="section-kicker">MILESTONES</span><h3>Roadmap status</h3></div></div><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={distribution} dataKey="value" nameKey="name" innerRadius={65} outerRadius={84} paddingAngle={4} stroke="none"><Cell fill="#7658e8" /><Cell fill="#f0a94f" /><Cell fill="#8d96aa" /><Cell fill="var(--chart-other)" /></Pie><Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)' }} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{percent}%</strong><span>complete</span></div></div><div className="donut-legend"><span><i className="legend-dot complete" />Completed <strong>{countStatus('completed')}</strong></span><span><i className="legend-dot current" />In progress <strong>{countStatus('in-progress')}</strong></span><span><i className="legend-dot upcoming" />Upcoming <strong>{countStatus('upcoming')}</strong></span><span><i className="legend-dot locked" />Locked <strong>{countStatus('locked')}</strong></span></div></article>
      <article className="chart-card card-surface chart-wide skill-chart"><div className="chart-heading"><div><span className="section-kicker">SKILL BY SKILL</span><h3>Path completion</h3></div><span className="chart-caption">{currentCareer.title}</span></div><div className="skill-bars">{skillData.map((item, index) => <div key={item.name} className="skill-bar-row"><span>{item.name}</span><div className="skill-track"><i style={{ width: `${item.progress}%`, background: COLORS[index % COLORS.length] }} /></div><strong>{item.progress}%</strong></div>)}</div></article>
      <article className="chart-card card-surface achievements-card"><div className="chart-heading"><div><span className="section-kicker">LITTLE WINS</span><h3>Achievements</h3></div><span className="achievement-count">{achievements.filter((item) => item.unlocked).length}/{achievements.length}</span></div><div className="achievement-list">{achievements.map(({ title, detail, unlocked, icon: Icon }) => <div className={`achievement-row ${unlocked ? 'unlocked' : ''}`} key={title}><span className="achievement-icon"><Icon size={16} /></span><span><strong>{title}</strong><small>{detail}</small></span>{unlocked && <Check size={15} className="achievement-check" />}</div>)}</div></article>
    </div>
    <div className="streak-note"><span className="streak-icon"><Flame size={18} /></span><div><strong>{streak ? `${streak} ${streak === 1 ? 'day' : 'days'} of showing up.` : 'Your next streak starts today.'}</strong><span>Consistency is its own kind of achievement. Keep your learning habit alive.</span></div><Sparkles size={17} className="streak-spark" /></div>
  </div>
}

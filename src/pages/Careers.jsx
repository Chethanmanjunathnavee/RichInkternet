import { useMemo, useState } from 'react'
import { ArrowRight, Check, Clock3, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { careers } from '../data/roadmaps'

export default function Careers() {
  const [params, setParams] = useSearchParams()
  const [category, setCategory] = useState('All paths')
  const query = params.get('q') || ''
  const { selectedCareer, selectCareer } = useApp()
  const navigate = useNavigate()
  const categories = ['All paths', 'Development', 'Data & AI']
  const filtered = useMemo(() => careers.filter((career) =>
    (category === 'All paths' || career.category === category) &&
    `${career.title} ${career.description} ${career.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase()),
  ), [query, category])

  const select = (career) => {
    selectCareer(career.id)
    setParams({})
    navigate('/roadmap')
  }

  return <div className="careers-page">
    <div className="page-intro"><div><span className="section-kicker">FIND YOUR DIRECTION</span><h1>Choose a path that<br /><span>feels like you.</span></h1><p>Explore a curated roadmap and learn the skills that move you forward.</p></div><div className="intro-decoration"><Sparkles size={26} /></div></div>
    <div className="career-toolbar"><div className="career-filters">{categories.map((item) => <button key={item} className={`filter-pill ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="career-search"><Search size={16} /><input placeholder="Search careers or skills" value={query} onChange={(event) => setParams((current) => { const next = new URLSearchParams(current); if (event.target.value) next.set('q', event.target.value); else next.delete('q'); return next }, { replace: true })} /><SlidersHorizontal size={16} /></label></div>
    {filtered.length ? <div className="career-grid">{filtered.map((career, index) => {
      const active = selectedCareer === career.id
      return <article className={`career-card card-surface ${active ? 'career-active' : ''}`} key={career.id} style={{ '--career-color': career.color, '--card-delay': `${index * 50}ms` }}>
        <div className="career-card-top"><span className="career-card-icon">{career.title.slice(0, 1)}</span><span className="career-category">{career.category}</span>{active && <span className="selected-mark"><Check size={13} /></span>}</div>
        <h3>{career.title}</h3><p>{career.description}</p>
        <div className="skill-tags">{career.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        <div className="career-card-meta"><span><Clock3 size={14} /> {career.duration}</span><span>{career.level}</span></div>
        <button className={`button ${active ? 'button-outline' : 'button-primary'} career-select`} onClick={() => select(career)}>{active ? 'Continue this path' : 'Explore this path'} <ArrowRight size={15} /></button>
      </article>
    })}</div> : <div className="empty-state card-surface"><span className="empty-icon"><Search size={20} /></span><h3>No paths found</h3><p>Try a different search or category.</p><button className="button button-outline" onClick={() => { setQuery(''); setCategory('All paths') }}>Clear filters</button></div>}
    <div className="custom-prompt"><span><Sparkles size={16} /></span><p><strong>Have a different goal in mind?</strong> Create a learning path that’s uniquely yours.</p><button className="text-link" onClick={() => navigate('/custom')}>Build a custom path <ArrowRight size={15} /></button></div>
  </div>
}

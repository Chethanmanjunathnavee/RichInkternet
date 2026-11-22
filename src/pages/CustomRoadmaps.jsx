import { useState } from 'react'
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronDown, Edit3, Plus, Route, Sparkles, Trash2, X } from 'lucide-react'
import { useApp } from '../hooks/useApp'

const emptyTopic = { title: '', description: '', hours: 2, prerequisite: '__previous__' }

export default function CustomRoadmaps() {
  const { customRoadmaps, addCustomRoadmap, updateCustomRoadmap, deleteCustomRoadmap } = useApp()
  const [selectedId, setSelectedId] = useState(customRoadmaps[0]?.id || null)
  const [showCreate, setShowCreate] = useState(false)
  const [roadmapForm, setRoadmapForm] = useState({ title: '', goal: '' })
  const [topicForm, setTopicForm] = useState(emptyTopic)
  const [editingTopic, setEditingTopic] = useState(null)
  const [errors, setErrors] = useState({})
  const [showTopicForm, setShowTopicForm] = useState(false)
  const roadmap = customRoadmaps.find((item) => item.id === selectedId) || customRoadmaps[0]

  const createRoadmap = (event) => {
    event.preventDefault()
    if (!roadmapForm.title.trim()) { setErrors({ title: 'Give your roadmap a name to get started.' }); return }
    const id = `custom-${Date.now()}`
    addCustomRoadmap({ ...roadmapForm, id, topics: [] })
    setSelectedId(id)
    setRoadmapForm({ title: '', goal: '' }); setErrors({}); setShowCreate(false)
  }
  const submitTopic = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!topicForm.title.trim()) nextErrors.title = 'Topic name is required.'
    if (!Number.isFinite(Number(topicForm.hours)) || Number(topicForm.hours) < 1) nextErrors.hours = 'Add an estimated time of at least one hour.'
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    const topics = [...(roadmap.topics || [])]
    if (editingTopic) {
      const index = topics.findIndex((topic) => topic.id === editingTopic)
      topics[index] = { ...topics[index], ...topicForm, hours: Number(topicForm.hours) }
    } else {
      topics.push({ ...topicForm, prerequisite: topicForm.prerequisite === '__previous__' ? (topics[topics.length - 1]?.id || '') : topicForm.prerequisite, id: `step-${Date.now()}`, hours: Number(topicForm.hours) })
    }
    updateCustomRoadmap(roadmap.id, { topics })
    setTopicForm(emptyTopic); setEditingTopic(null); setErrors({}); setShowTopicForm(false)
  }
  const editTopic = (topic) => { setEditingTopic(topic.id); setTopicForm({ title: topic.title, description: topic.description || '', hours: topic.hours || 2, prerequisite: topic.prerequisite || '' }); setErrors({}); setShowTopicForm(true) }
  const removeTopic = (id) => {
    if (!window.confirm('Delete this topic from your roadmap?')) return
    updateCustomRoadmap(roadmap.id, { topics: roadmap.topics.filter((topic) => topic.id !== id).map((topic) => topic.prerequisite === id ? { ...topic, prerequisite: '' } : topic) })
  }
  const removeRoadmap = (item) => {
    if (!window.confirm(`Delete "${item.title}" and all its topics? This cannot be undone.`)) return
    deleteCustomRoadmap(item.id)
    setSelectedId(customRoadmaps.find((path) => path.id !== item.id)?.id || null)
  }

  return <div className="custom-page">
    <div className="page-intro custom-intro"><div><span className="section-kicker">MAKE IT YOURS</span><h1>Build a path<br /><span>of your own.</span></h1><p>Turn that big idea into a sequence of small, satisfying steps.</p></div><button className="button button-primary" onClick={() => { setShowCreate(true); setErrors({}) }}><Plus size={16} /> New roadmap</button></div>
    {!customRoadmaps.length ? <div className="custom-empty card-surface"><div className="custom-empty-art"><Route size={34} /><span>✦</span></div><h2>Your blank canvas is waiting.</h2><p>Create a custom learning roadmap, add topics, and connect them in the order that makes sense for you.</p><button className="button button-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Create your first roadmap</button><div className="empty-suggestion"><Sparkles size={14} /> Try a goal like “Learn to draw” or “Launch my side project”</div></div> : <div className="custom-workspace">
      <aside className="custom-list card-surface"><div className="custom-list-header"><div><span className="section-kicker">YOUR COLLECTION</span><h3>Your roadmaps</h3></div><button className="icon-btn" title="Create roadmap" onClick={() => setShowCreate(true)}><Plus size={17} /></button></div>{customRoadmaps.map((item) => <button key={item.id} className={`custom-list-item ${roadmap?.id === item.id ? 'active' : ''}`} onClick={() => { setSelectedId(item.id); setShowTopicForm(false) }}><span className="custom-list-icon"><Route size={16} /></span><span><strong>{item.title}</strong><small>{item.topics.length} {item.topics.length === 1 ? 'step' : 'steps'}</small></span><ChevronDown size={15} className="custom-chevron" /></button>)}<button className="text-link add-path-link" onClick={() => setShowCreate(true)}><Plus size={15} /> Create another path</button></aside>
      {roadmap && <section className="custom-editor card-surface"><div className="custom-editor-header"><div><span className="section-kicker">YOUR CUSTOM ROADMAP</span><h2>{roadmap.title}</h2><p>{roadmap.goal || 'Add a goal to give this learning path some direction.'}</p></div><button className="icon-btn danger-icon" title="Delete roadmap" onClick={() => removeRoadmap(roadmap)}><Trash2 size={17} /></button></div>
        <div className="custom-steps-header"><strong>Your learning steps <span>{roadmap.topics.length}</span></strong><button className="button button-outline button-small" onClick={() => { setTopicForm(emptyTopic); setEditingTopic(null); setErrors({}); setShowTopicForm(true) }}><Plus size={14} /> Add topic</button></div>
        {roadmap.topics.length ? <div className="custom-steps">{roadmap.topics.map((topic, index) => <div key={topic.id} className="custom-step-wrap"><article className="custom-step"><span className="custom-step-num">{String(index + 1).padStart(2, '0')}</span><div className="custom-step-copy"><strong>{topic.title}</strong><small>{topic.hours} hours {topic.prerequisite ? `· After ${roadmap.topics.find((item) => item.id === topic.prerequisite)?.title || 'previous step'}` : '· No prerequisites'}</small>{topic.description && <p>{topic.description}</p>}</div><button className="icon-btn" title="Edit topic" onClick={() => editTopic(topic)}><Edit3 size={15} /></button><button className="icon-btn danger-icon" title="Delete topic" onClick={() => removeTopic(topic.id)}><Trash2 size={15} /></button></article>{index < roadmap.topics.length - 1 && <div className="step-connector"><ArrowDown size={15} /></div>}</div>)}</div> : <div className="custom-no-topics"><BookOpen size={22} /><strong>Your first step goes here.</strong><span>Add a topic to start shaping your roadmap.</span><button className="text-link" onClick={() => setShowTopicForm(true)}><Plus size={14} /> Add your first topic</button></div>}
        {showTopicForm && <form className="topic-form" onSubmit={submitTopic}><div className="form-heading"><strong>{editingTopic ? 'Edit topic' : 'Add a learning step'}</strong><button type="button" className="icon-btn" onClick={() => setShowTopicForm(false)} aria-label="Close form"><X size={16} /></button></div><label>Topic name<input autoFocus placeholder="e.g. Learn the fundamentals" value={topicForm.title} onChange={(event) => setTopicForm({ ...topicForm, title: event.target.value })} /></label>{errors.title && <span className="field-error">{errors.title}</span>}<label>Description <span className="optional-label">optional</span><textarea rows="2" placeholder="What will you learn?" value={topicForm.description} onChange={(event) => setTopicForm({ ...topicForm, description: event.target.value })} /></label><div className="form-two-col"><label>Estimated hours<input type="number" min="1" value={topicForm.hours} onChange={(event) => setTopicForm({ ...topicForm, hours: event.target.value })} />{errors.hours && <span className="field-error">{errors.hours}</span>}</label><label>Prerequisite<select value={topicForm.prerequisite} onChange={(event) => setTopicForm({ ...topicForm, prerequisite: event.target.value })}><option value="">None — no prerequisite</option>{!editingTopic && <option value="__previous__">Previous topic (recommended)</option>}{roadmap.topics.filter((item) => item.id !== editingTopic && (!editingTopic || roadmap.topics.findIndex((candidate) => candidate.id === item.id) < roadmap.topics.findIndex((candidate) => candidate.id === editingTopic))).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label></div><div className="form-actions"><button type="button" className="button button-outline" onClick={() => setShowTopicForm(false)}>Cancel</button><button className="button button-primary" type="submit"><Check size={15} /> {editingTopic ? 'Save changes' : 'Add topic'}</button></div></form>}
      </section>}
    </div>}
    {showCreate && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowCreate(false)}><form className="create-modal card-surface" onSubmit={createRoadmap}><button type="button" className="icon-btn modal-close" onClick={() => setShowCreate(false)} aria-label="Close"><X size={18} /></button><span className="modal-icon"><Route size={20} /></span><span className="section-kicker">A FRESH START</span><h2>Name your roadmap</h2><p>Pick a goal to begin. You can refine it and add learning steps anytime.</p><label>Roadmap name<input autoFocus placeholder="e.g. Design my first app" value={roadmapForm.title} onChange={(event) => setRoadmapForm({ ...roadmapForm, title: event.target.value })} /></label>{errors.title && <span className="field-error">{errors.title}</span>}<label>What are you working toward?<textarea rows="3" placeholder="A short goal or description (optional)" value={roadmapForm.goal} onChange={(event) => setRoadmapForm({ ...roadmapForm, goal: event.target.value })} /></label><div className="form-actions"><button type="button" className="button button-outline" onClick={() => setShowCreate(false)}>Not now</button><button className="button button-primary" type="submit">Create roadmap <ArrowRight size={15} /></button></div></form></div>}
  </div>
}

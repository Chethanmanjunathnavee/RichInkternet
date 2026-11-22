import { useRef, useState } from 'react'
import { AlertTriangle, Check, Download, Moon, Sun, Upload, UserRound, X } from 'lucide-react'
import { useApp } from '../hooks/useApp'

export default function Settings() {
  const { profile, updateProfile, theme, updateTheme, resetProgress, resetAll, importData } = useApp()
  const [form, setForm] = useState(profile)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState('')
  const fileInput = useRef(null)

  const saveProfile = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setSaved(false); return }
    updateProfile(form); setErrors({}); setSaved(true); setMessage('')
  }
  const exportBackup = () => {
    const data = localStorage.getItem('skillmap-v1') || '{}'
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url; link.download = `skillmap-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click()
    URL.revokeObjectURL(url)
    setMessage('Your backup file has been downloaded.')
  }
  const importBackup = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      importData(data)
      setForm(data.profile)
      setMessage('Your SkillMap backup was restored.')
    } catch (error) {
      setMessage(error instanceof SyntaxError ? 'That file is not valid JSON.' : error.message)
    }
    event.target.value = ''
  }
  const clearProgress = () => {
    if (window.confirm('Reset your completed topics and learning activity? Your profile and custom roadmaps will be kept.')) {
      resetProgress(); setMessage('Your learning progress has been reset.')
    }
  }
  const wipeData = () => {
    if (window.confirm('Reset all SkillMap data, including your profile and custom roadmaps? This cannot be undone.')) {
      resetAll(); setForm({ name: 'Alex Morgan', email: 'alex.morgan@email.com', goal: 'Land my first developer role' }); setMessage('All app data has been reset.')
    }
  }

  return <div className="settings-page">
    <div className="page-intro settings-intro"><div><span className="section-kicker">MAKE IT FEEL LIKE YOURS</span><h1>Your space,<br /><span>your settings.</span></h1><p>Keep your profile and learning experience just the way you like it.</p></div><div className="settings-avatar"><UserRound size={25} /></div></div>
    {message && <div className="settings-message"><Check size={15} />{message}<button className="icon-btn" onClick={() => setMessage('')} aria-label="Dismiss"><X size={15} /></button></div>}
    <div className="settings-sections">
      <form className="settings-card card-surface" onSubmit={saveProfile}><div className="settings-card-heading"><span className="settings-heading-icon"><UserRound size={18} /></span><div><h3>Profile information</h3><p>Keep your personal details up to date.</p></div></div><div className="settings-form-grid"><label>Full name<input value={form.name} onChange={(event) => { setForm({ ...form, name: event.target.value }); setSaved(false) }} />{errors.name && <span className="field-error">{errors.name}</span>}</label><label>Email address<input type="email" value={form.email} onChange={(event) => { setForm({ ...form, email: event.target.value }); setSaved(false) }} />{errors.email && <span className="field-error">{errors.email}</span>}</label><label className="full-field">My learning goal<textarea rows="2" value={form.goal} onChange={(event) => { setForm({ ...form, goal: event.target.value }); setSaved(false) }} placeholder="What are you working toward?" /></label></div><div className="settings-card-footer"><span>{saved ? <><Check size={14} /> Changes saved</> : 'Your profile is stored on this device.'}</span><button type="submit" className="button button-primary">Save changes</button></div></form>
      <section className="settings-card card-surface"><div className="settings-card-heading"><span className="settings-heading-icon theme-icon"><Sun size={18} /></span><div><h3>Appearance</h3><p>Choose the look that feels right for you.</p></div></div><div className="theme-options"><button className={`theme-option ${theme === 'light' ? 'selected' : ''}`} onClick={() => updateTheme('light')}><span className="theme-preview light-preview"><i /><i /><i /></span><span><Sun size={15} /> Light</span>{theme === 'light' && <Check size={15} />}</button><button className={`theme-option ${theme === 'dark' ? 'selected' : ''}`} onClick={() => updateTheme('dark')}><span className="theme-preview dark-preview"><i /><i /><i /></span><span><Moon size={15} /> Dark</span>{theme === 'dark' && <Check size={15} />}</button></div></section>
      <section className="settings-card card-surface"><div className="settings-card-heading"><span className="settings-heading-icon data-icon"><Download size={18} /></span><div><h3>Your data</h3><p>Your information stays in this browser. Export a backup anytime.</p></div></div><div className="data-actions"><div><strong>Backup your learning journey</strong><small>Save your profile, progress, and custom paths to a JSON file.</small></div><button className="button button-outline" onClick={exportBackup}><Download size={15} /> Export data</button></div><div className="data-actions"><div><strong>Restore a backup</strong><small>Import a previously saved SkillMap JSON backup.</small></div><input ref={fileInput} className="visually-hidden" type="file" accept=".json,application/json" onChange={importBackup} /><button className="button button-outline" onClick={() => fileInput.current?.click()}><Upload size={15} /> Import data</button></div></section>
      <section className="settings-card card-surface danger-zone"><div className="settings-card-heading"><span className="settings-heading-icon danger-heading"><AlertTriangle size={18} /></span><div><h3>Start fresh</h3><p>These actions can’t be undone. Your browser data will be changed.</p></div></div><div className="data-actions"><div><strong>Reset learning progress</strong><small>Clear completed topics and activity; keep your profile and custom paths.</small></div><button className="button button-danger-outline" onClick={clearProgress}>Reset progress</button></div><div className="data-actions"><div><strong>Reset all app data</strong><small>Restore SkillMap to its original state on this device.</small></div><button className="button button-danger" onClick={wipeData}>Reset everything</button></div></section>
    </div>
  </div>
}

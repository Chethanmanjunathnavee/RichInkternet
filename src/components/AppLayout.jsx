import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Activity, ArrowLeft, BarChart3, BookOpen, ChevronDown, Compass, LayoutDashboard, LogOut, Menu, Moon, Plus, Search, Settings2, Sun, X } from 'lucide-react'
import { useApp } from '../hooks/useApp'

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/careers', label: 'Career paths', icon: Compass },
  { to: '/roadmap', label: 'My roadmap', icon: BookOpen },
  { to: '/analytics', label: 'Progress', icon: BarChart3 },
  { to: '/custom', label: 'Custom paths', icon: Plus },
]

const titleByPath = {
  '/dashboard': 'Overview', '/careers': 'Explore career paths', '/roadmap': 'My learning roadmap',
  '/analytics': 'Progress analytics', '/custom': 'Custom roadmaps', '/settings': 'Profile & settings',
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { currentCareer, profile, theme, updateTheme } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const title = titleByPath[location.pathname] || (location.pathname.startsWith('/topic/') ? 'Topic details' : 'SkillMap')

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row"><div className="brand-mark"><Activity size={20} strokeWidth={2.6} /></div><span>skillmap<span className="brand-dot">.</span></span><button className="icon-btn sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <button className="career-switcher" onClick={() => navigate('/careers')}><span className="career-avatar" style={{ background: currentCareer.color }}>{currentCareer.title.slice(0, 1)}</span><span className="career-switch-copy"><strong>{currentCareer.title}</strong><small>Learning path</small></span><ChevronDown size={16} /></button>
        <nav className="side-nav" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span>{to === '/roadmap' && <span className="nav-count">{currentCareer.topics.length}</span>}</NavLink>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><div className="tip-icon"><BookOpen size={16} /></div><strong>Small steps add up.</strong><p>Keep showing up and your future self will thank you.</p><button onClick={() => navigate('/roadmap')}>Continue learning <ArrowLeft size={14} /></button></div>
          <NavLink to="/settings" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Settings2 size={18} /><span>Settings</span></NavLink>
          <div className="sidebar-user"><div className="user-avatar">{profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div><div className="user-copy"><strong>{profile.name}</strong><small>Free plan</small></div><button className="icon-btn" aria-label="Open profile settings" onClick={() => navigate('/settings')}><LogOut size={16} /></button></div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn menu-toggle" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{title}</strong></div>
          <div className="topbar-actions"><label className="search-box"><Search size={16} /><input placeholder="Search paths..." value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && navigate(`/careers?q=${encodeURIComponent(search)}`)} /><kbd>⌘ K</kbd></label><button className="icon-btn theme-toggle" title="Toggle theme" onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button><button className="top-avatar" title="Profile settings" onClick={() => navigate('/settings')}>{profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</button></div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}

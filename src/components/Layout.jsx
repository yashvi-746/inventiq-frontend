import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const navItems = [
  { to: '/',          icon: '⬛', label: 'Dashboard' },
  { to: '/chat',      icon: '💬', label: 'AI Chat' },
  { to: '/inventory', icon: '📦', label: 'Inventory' },
  { to: '/offers',    icon: '📣', label: 'Offers' },
  { to: '/reports',   icon: '📊', label: 'Reports' },
  { to: '/settings',  icon: '⚙️',  label: 'Settings' },
]

const s = {
  shell: { display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg)' },
  sidebar: { width:230, background:'var(--bg2)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', flexShrink:0, boxShadow:'2px 0 8px rgba(0,0,0,0.04)' },
  logo: { padding:'24px 20px 16px', borderBottom:'1px solid var(--border)' },
  logoTitle: { fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:'var(--purple)', letterSpacing:'-0.5px' },
  logoSub: { fontSize:11, color:'var(--muted2)', marginTop:2 },
  nav: { flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:2 },
  navLink: (active) => ({
    display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
    borderRadius:8, fontSize:14, fontWeight: active ? 500 : 400,
    color: active ? 'var(--purple)' : 'var(--muted)',
    background: active ? 'var(--purple-xl)' : 'transparent',
    border: active ? '1px solid #DDD6FE' : '1px solid transparent',
    transition:'all .15s',
  }),
  navIcon: { fontSize:16, width:20, textAlign:'center' },
  bottom: { padding:'12px 10px', borderTop:'1px solid var(--border)' },
  userCard: { display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:8, background:'var(--bg3)', border:'1px solid var(--border)' },
  avatar: { width:32, height:32, borderRadius:8, background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'white', flexShrink:0 },
  userName: { fontSize:13, fontWeight:500, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  shopName: { fontSize:11, color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  logoutBtn: { marginTop:6, width:'100%', padding:'8px', borderRadius:8, background:'transparent', border:'1px solid var(--border)', color:'var(--muted)', fontSize:13, transition:'all .15s' },
  main: { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  topbar: { height:56, borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', background:'var(--bg2)', flexShrink:0 },
  topbarTitle: { fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700 },
  content: { flex:1, overflow:'auto', padding:24, background:'var(--bg)' },
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [hoveredLogout, setHoveredLogout] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'IQ'

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoTitle}>InventIQ</div>
          <div style={s.logoSub}>Apni Dukaan, Apna AI</div>
        </div>
        <nav style={s.nav}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} style={({ isActive }) => s.navLink(isActive)}>
              <span style={s.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={s.bottom}>
          <div style={s.userCard}>
            <div style={s.avatar}>{initials}</div>
            <div style={{flex:1, overflow:'hidden'}}>
              <div style={s.userName}>{user?.name}</div>
              <div style={s.shopName}>{user?.shopName}</div>
            </div>
          </div>
          <button
            style={{...s.logoutBtn, background: hoveredLogout ? '#FFF1F2' : 'transparent', color: hoveredLogout ? 'var(--coral)' : 'var(--muted)'}}
            onMouseEnter={() => setHoveredLogout(true)}
            onMouseLeave={() => setHoveredLogout(false)}
            onClick={handleLogout}
          >Logout</button>
        </div>
      </aside>
      <main style={s.main}>
        <div style={s.content}><Outlet /></div>
      </main>
    </div>
  )
}

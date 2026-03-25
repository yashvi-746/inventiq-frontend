import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { inventoryApi, chatApi } from '../api'
import StatCard from '../components/StatCard'
import StockAlertCard from '../components/StockAlertCard'
import SalesChart from '../components/SalesChart'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { user } = useAuth()
  const [inventory, setInventory] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [report, setReport] = useState({ daily:[], topItems:[], totalRevenue:0 })
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [inv, low, rep] = await Promise.all([inventoryApi.getAll(), inventoryApi.getLowStock(), chatApi.getReports(7)])
      setInventory(inv.data); setLowStock(low.data); setReport(rep.data)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const totalValue = inventory.reduce((a,i) => a + i.quantity * i.price, 0)

  const quickActions = [
    { to:'/chat',      label:'Open AI Chat',     sub:'Talk in Hindi/Gujarati/English', color:'var(--purple)', bg:'var(--purple-xl)', border:'#DDD6FE' },
    { to:'/inventory', label:'Manage Inventory', sub:'Add or update stock',             color:'var(--teal)',   bg:'var(--teal-xl)',   border:'#99F6E4' },
    { to:'/offers',    label:'Generate Offer',   sub:'Create WhatsApp promo',           color:'var(--coral)',  bg:'var(--coral-xl)', border:'#FECDD3' },
    { to:'/reports',   label:'View Reports',     sub:'Sales trends & insights',         color:'var(--amber)',  bg:'var(--amber-xl)', border:'#FDE68A' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:28, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:700, color:'var(--text)' }}>
            {greeting}, {user?.name?.split(' ')[0]}! 👋
          </div>
          <div style={{ fontSize:14, color:'var(--muted)', marginTop:4 }}>{user?.shopName} — here's your store overview</div>
        </div>
        <button onClick={load} style={{ padding:'8px 16px', borderRadius:8, background:'white', border:'1px solid var(--border)', color:'var(--muted)', fontSize:13, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Total Items" value={inventory.length} sub="in inventory" accent="#6D28D9" accentBg="#EDE9FE" />
        <StatCard label="Low Stock" value={lowStock.length} sub="need reorder" accent="#E11D48" accentBg="#FFE4E6" />
        <StatCard label="Stock Value" value={`₹${totalValue.toLocaleString()}`} sub="estimated" accent="#D97706" accentBg="#FEF3C7" />
        <StatCard label="Revenue (7d)" value={`₹${(report.totalRevenue||0).toLocaleString()}`} sub="this week" accent="#059669" accentBg="#D1FAE5" />
      </div>

      {/* Chart + Alerts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20, marginBottom:20 }}>
        <SalesChart data={report.daily} />
        <StockAlertCard items={lowStock} />
      </div>

      {/* Quick Actions + Top Items */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:12, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:14, color:'var(--text)' }}>Quick Actions</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {quickActions.map(a => (
              <Link key={a.to} to={a.to} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:10, background:a.bg, border:`1px solid ${a.border}`, transition:'transform .1s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateX(3px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateX(0)'}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:a.color, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:a.color }}>{a.label}</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>{a.sub}</div>
                </div>
                <div style={{ marginLeft:'auto', color:a.color, fontSize:16 }}>›</div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:12, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:14, color:'var(--text)' }}>Top Selling Items (7d)</div>
          {!report.topItems?.length
            ? <div style={{ fontSize:13, color:'var(--muted)', textAlign:'center', padding:'24px 0', background:'var(--bg3)', borderRadius:8 }}>No sales data yet. Add sales via AI Chat!</div>
            : report.topItems.map((item, i) => (
              <div key={item.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom: i < report.topItems.length-1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:24, height:24, borderRadius:6, background:'var(--purple-xl)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'var(--purple)' }}>{i+1}</div>
                  <span style={{ fontSize:13, color:'var(--text)', fontWeight:500 }}>{item.name}</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--amber)' }}>₹{item.revenue}</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>{item.qty} units</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

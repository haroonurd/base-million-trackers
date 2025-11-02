export default function Stats({ stats }) {
  return (
    <section style={{ display:'flex', gap:20, marginTop: 8 }}>
      <div style={{ padding:12, border:'1px solid #eee', borderRadius:8, minWidth:160 }}>
        <div style={{ fontSize:12, color:'#666' }}>Qualifying txs (24h)</div>
        <div style={{ fontSize:20, fontWeight:700 }}>{stats.totalCount}</div>
      </div>
      <div style={{ padding:12, border:'1px solid #eee', borderRadius:8, minWidth:220 }}>
        <div style={{ fontSize:12, color:'#666' }}>Total ETH volume (24h)</div>
        <div style={{ fontSize:20, fontWeight:700 }}>{stats.totalVolumeEth}</div>
      </div>
    </section>
  )
}

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function Charts({ hourly }) {
  const labels = hourly.map((_,i)=>`${i}h`)
  const counts = hourly.map(h=>h.count)
  const volumes = hourly.map(h=>h.volumeEth)

  const countData = { labels, datasets: [{ label: 'Qualifying txs per hour', data: counts, tension: 0.3 }] }
  const volData = { labels, datasets: [{ label: 'ETH volume per hour', data: volumes, tension: 0.3 }] }

  return (
    <section style={{ marginTop:20 }}>
      <div style={{ maxWidth:900 }}>
        <h4 style={{ marginBottom:8 }}>Hourly counts</h4>
        <div style={{ background:'#fff', padding:12, border:'1px solid #f0f0f0', borderRadius:8 }}>
          <Bar data={countData} />
        </div>
        <h4 style={{ marginTop:20, marginBottom:8 }}>Hourly ETH volume</h4>
        <div style={{ background:'#fff', padding:12, border:'1px solid #f0f0f0', borderRadius:8 }}>
          <Line data={volData} />
        </div>
      </div>
    </section>
  )
}

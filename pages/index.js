import Head from 'next/head'
import useSWR from 'swr'
import Stats from '../src/components/Stats'
import Charts from '../src/components/Charts'

const fetcher = (url) => fetch(url).then(r => r.json())

export default function Home() {
  const { data, error } = useSWR('/api/scan', fetcher, { refreshInterval: 60_000 })

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', padding: 28, color: '#111' }}>
      <Head>
        <title>Base Million Tracker</title>
      </Head>

      <main style={{ maxWidth: 980, margin: '0 auto' }}>
        <header style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Base Million Tracker</h1>
          <p style={{ marginTop: 6, color:'#555' }}>
            Tracks single transactions with native ETH value ≥ 1,000,000 ETH (Base mainnet).
          </p>
        </header>

        {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
        {!data && <div>Loading metrics…</div>}

        {data && (
          <>
            <Stats stats={data.summary} />
            <Charts hourly={data.hourly} />
            <section style={{ marginTop: 24 }}>
              <h3 style={{ marginBottom: 8 }}>Recent qualifying transactions</h3>
              <ul style={{ paddingLeft: 18 }}>
                {data.recent.slice(0,50).map(tx => (
                  <li key={tx.hash} style={{ marginBottom: 8 }}>
                    <a href={`https://basescan.org/tx/${tx.hash}`} target="_blank" rel="noreferrer">
                      {tx.hash}
                    </a>
                    — {tx.from} → {tx.to} — {tx.valueEth} ETH — {new Date(tx.timestamp*1000).toLocaleString()}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

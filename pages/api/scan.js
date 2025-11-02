import { JsonRpcProvider, formatEther } from 'ethers'

// Threshold: 1,000,000 ETH in wei = 1e24
const THRESHOLD_WEI = BigInt('1000000000000000000000000')

// Simple cache to avoid repeated scans
let cache = { time: 0, data: null }

export default async function handler(req, res) {
  try {
    const now = Date.now()
    if (cache.data && (now - cache.time) < 60_000) {
      return res.status(200).json(cache.data)
    }

    const rpc = process.env.QUICKNODE_RPC || process.env.BASE_RPC_URL || 'https://mainnet.base.org'
    const provider = new JsonRpcProvider(rpc)

    const blocksPerDay = Number(process.env.SCAN_BLOCK_WINDOW || 7200)
    const latest = await provider.getBlockNumber()
    const fromBlock = Math.max(0, latest - blocksPerDay)

    const hourly = Array.from({ length: 24 }, () => ({ count: 0, volumeEth: 0 }))
    const recent = []
    let totalCount = 0
    let totalVolumeWei = BigInt(0)

    const BATCH = 50
    for (let b = latest; b > fromBlock; b -= BATCH) {
      const top = b
      const bottom = Math.max(fromBlock, b - BATCH + 1)

      // Fetch blocks one by one (v6 compatible)
      for (let i = top; i >= bottom; i--) {
        const block = await provider.getBlockWithTransactions(i)
        if (!block) continue

        const hourAgo = (Date.now() / 1000 - block.timestamp) / 3600
        let hourIndex = 23 - Math.floor(hourAgo)
        if (hourIndex < 0) hourIndex = 0
        if (hourIndex > 23) hourIndex = 23

        for (const tx of block.transactions) {
          const v = BigInt(tx.value.toString())
          if (v >= THRESHOLD_WEI) {
            totalCount += 1
            totalVolumeWei += v
            const valueEth = Number(formatEther(v))
            hourly[hourIndex].count += 1
            hourly[hourIndex].volumeEth += valueEth
            recent.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              valueEth,
              timestamp: block.timestamp,
            })
          }
        }
      }
    }

    const summary = {
      totalCount,
      totalVolumeEth: Number(formatEther(totalVolumeWei || BigInt(0))),
    }

    const data = {
      summary,
      hourly,
      recent: recent.sort((a, b) => b.timestamp - a.timestamp),
    }

    cache = { time: now, data }
    res.status(200).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
}

const fs = require('fs')
const { JsonRpcProvider, formatEther } = require('ethers')

// Threshold: 1,000,000 ETH
const THRESHOLD_WEI = BigInt('1000000000000000000000000')

async function run() {
  const rpc = process.env.QUICKNODE_RPC || process.env.BASE_RPC_URL || 'https://mainnet.base.org'
  const provider = new JsonRpcProvider(rpc)

  const latest = await provider.getBlockNumber()
  const blocksPerDay = Number(process.env.SCAN_BLOCK_WINDOW || 7200)
  const fromBlock = Math.max(0, latest - blocksPerDay)

  const hourly = Array.from({ length: 24 }, () => ({ count: 0, volumeEth: 0 }))
  const recent = []
  let totalCount = 0
  let totalVolumeWei = BigInt(0)

  const BATCH = 50
  for (let b = latest; b > fromBlock; b -= BATCH) {
    const top = b
    const bottom = Math.max(fromBlock, b - BATCH + 1)
    for (let i = top; i >= bottom; i--) {
      const block = await provider.getBlockWithTransactions(i)
      if (!block) continue
      const hourAgo = Math.floor(Date.now() / 1000 - block.timestamp) / 3600
      let hourIndex = 23 - Math.floor(hourAgo)
      if (hourIndex < 0) hourIndex = 0
      if (hourIndex > 23) hourIndex = 23

      for (const tx of block.transactions) {
        const v = BigInt(tx.value.toString())
        if (v >= THRESHOLD_WEI) {
          totalCount += 1
          totalVolumeWei += v
          recent.push({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            valueEth: Number(formatEther(v)),
            timestamp: block.timestamp,
          })
          hourly[hourIndex].count += 1
          hourly[hourIndex].volumeEth += Number(formatEther(v))
        }
      }
    }
  }

  const out = {
    summary: { totalCount, totalVolumeEth: Number(formatEther(totalVolumeWei || BigInt(0))) },
    hourly,
    recent,
  }

  fs.mkdirSync('public', { recursive: true })
  fs.writeFileSync('public/data.json', JSON.stringify(out, null, 2))
  console.log('Wrote public/data.json')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

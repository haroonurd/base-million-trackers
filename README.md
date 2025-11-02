# Base Million Tracker (Minimal White Theme)

Minimal Next.js dApp that scans Base mainnet for **single-transaction** native ETH transfers >= **1,000,000 ETH**,
aggregates counts and volumes for the past 24 hours, and shows simple charts.

## How to use

1. Create a new **empty** GitHub repo.
2. Upload the files from this ZIP into the repo root (preserve folders `pages/`, `src/`).
3. In Vercel, import the GitHub repo and set environment variables (see below).
4. Deploy — Vercel will build and serve the app.

## Environment variables (set in Vercel)
- `BASE_RPC_URL` (optional) — default `https://mainnet.base.org`
- `QUICKNODE_RPC` (recommended) — your QuickNode/Alchemy/other RPC URL for reliable scanning
- `SCAN_BLOCK_WINDOW` (optional) — number of blocks to scan (~7200 default for ~24h)

## Important notes
- This app scans blocks using RPC and is RPC-intensive. For production, use an indexed provider or the included GitHub Action to precompute `public/data.json`.
- Threshold used: **1,000,000 ETH** = `1e6 * 1e18 wei` = `1e24 wei`.


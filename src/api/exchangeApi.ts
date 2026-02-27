import { CryptoAsset } from "../types/crypto";

// Primary data source: CoinCap public API.
// Fallback: static in-memory dataset so the app still works if DNS/network is blocked.

const COINCAP_BASE_URL = "https://api.coincap.io/v2";

interface CoinCapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
}

interface CoinCapListResponse {
  data: CoinCapAsset[];
}

const FALLBACK_ASSETS: CryptoAsset[] = [
  { code: "BTC", name: "Bitcoin", priceUsd: 65000 },
  { code: "ETH", name: "Ethereum", priceUsd: 3400 },
  { code: "USDT", name: "Tether", priceUsd: 1 },
  { code: "BNB", name: "BNB", priceUsd: 420 },
  { code: "SOL", name: "Solana", priceUsd: 150 },
  { code: "XRP", name: "XRP", priceUsd: 0.6 },
  { code: "ADA", name: "Cardano", priceUsd: 0.5 },
  { code: "DOGE", name: "Dogecoin", priceUsd: 0.1 },
  { code: "MATIC", name: "Polygon", priceUsd: 0.9 },
  { code: "AVAX", name: "Avalanche", priceUsd: 35 }
];

export async function fetchCryptoAssets(limit: number): Promise<CryptoAsset[]> {
  try {
    const res = await fetch(`${COINCAP_BASE_URL}/assets?limit=${limit}`);
    if (!res.ok) {
      throw new Error("Failed to load crypto assets from CoinCap");
    }

    const json = (await res.json()) as CoinCapListResponse;
    const assets = json.data ?? [];
    if (!assets.length) {
      throw new Error("Empty assets list from CoinCap");
    }

    return assets.map((asset) => ({
      code: asset.symbol,
      name: asset.name,
      priceUsd: asset.priceUsd ? Number(asset.priceUsd) : null
    }));
  } catch (error) {
    // Network/DNS errors: fall back to static data so UI keeps working.
    // eslint-disable-next-line no-console
    console.warn("Using fallback crypto assets due to API error:", error);
    return FALLBACK_ASSETS.slice(0, limit);
  }
}

export async function fetchSingleAssetPriceUsd(code: string): Promise<number> {
  try {
    const res = await fetch(
      `${COINCAP_BASE_URL}/assets?search=${encodeURIComponent(code)}`
    );
    if (!res.ok) {
      throw new Error("Failed to load asset price from CoinCap");
    }

    const json = (await res.json()) as CoinCapListResponse;
    const match = (json.data ?? []).find(
      (asset) => asset.symbol.toUpperCase() === code.toUpperCase()
    );

    if (!match || !match.priceUsd) {
      throw new Error(`No USD price found for ${code}`);
    }

    return Number(match.priceUsd);
  } catch (error) {
    const fallback = FALLBACK_ASSETS.find(
      (asset) => asset.code.toUpperCase() === code.toUpperCase()
    );
    if (fallback?.priceUsd != null) {
      return fallback.priceUsd;
    }
    throw new Error(`No USD price available for ${code}`);
  }
}



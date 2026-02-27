export interface CryptoSymbol {
  code: string;
  description: string;
}

export interface CryptoAsset {
  code: string;
  name: string;
  priceUsd: number | null;
}

export type SortOption = "name" | "price";


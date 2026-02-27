import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoAssets } from "../api/exchangeApi";
import { useAuthStore } from "../store/authStore";
import { CryptoAsset } from "../types/crypto";

interface TradePageProps {
  initialAssetCode?: string | null;
  onRequireLogin?: () => void;
}

type TradeMode = "CRYPTO_TO_FIAT" | "FIAT_TO_CRYPTO";

const TRADE_ASSET_LIMIT = 30;

export const TradePage: React.FC<TradePageProps> = ({
  initialAssetCode,
  onRequireLogin
}) => {
  const user = useAuthStore((s) => s.user);
  const [mode, setMode] = useState<TradeMode>("CRYPTO_TO_FIAT");
  const [baseAmount, setBaseAmount] = useState<string>("");
  const [selectedCode, setSelectedCode] = useState<string | undefined>();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cryptoAssets", TRADE_ASSET_LIMIT],
    queryFn: () => fetchCryptoAssets(TRADE_ASSET_LIMIT),
    staleTime: 1000 * 60
  });

  useEffect(() => {
    if (!data || !data.length) return;
    if (initialAssetCode) {
      const exists = data.find(
        (asset) => asset.code.toUpperCase() === initialAssetCode.toUpperCase()
      );
      if (exists) {
        setSelectedCode(exists.code);
        return;
      }
    }
    if (!selectedCode) {
      setSelectedCode(data[0].code);
    }
  }, [data, initialAssetCode, selectedCode]);

  const selectedAsset: CryptoAsset | undefined = useMemo(() => {
    if (!data || !selectedCode) return undefined;
    return data.find((asset) => asset.code === selectedCode);
  }, [data, selectedCode]);

  const numericBase = useMemo(() => {
    const parsed = parseFloat(baseAmount.replace(",", "."));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }, [baseAmount]);

  const { cryptoAmount, fiatAmount } = useMemo(() => {
    const price = selectedAsset?.priceUsd ?? null;
    if (!price || numericBase <= 0) {
      return { cryptoAmount: 0, fiatAmount: 0 };
    }
    if (mode === "CRYPTO_TO_FIAT") {
      return { cryptoAmount: numericBase, fiatAmount: numericBase * price };
    }
    return { cryptoAmount: numericBase / price, fiatAmount: numericBase };
  }, [selectedAsset, numericBase, mode]);

  if (!user) {
    return (
      <div className="guard-card">
        <div className="guard-title">Sign in to access trading</div>
        <div className="guard-text">
          Trading is restricted to authenticated users in this CBB sandbox
          environment. Please log in with any email and password to simulate a
          trading session.
        </div>
        <button
          type="button"
          className="button button-primary"
          onClick={onRequireLogin}
        >
          Login to Trade
        </button>
      </div>
    );
  }

  const handleSwap = () => {
    setMode((previous) =>
      previous === "CRYPTO_TO_FIAT" ? "FIAT_TO_CRYPTO" : "CRYPTO_TO_FIAT"
    );
    setBaseAmount("");
  };

  const handleAssetChange = (code: string) => {
    setSelectedCode(code);
    setBaseAmount("");
  };

  const handleAmountChange = (value: string) => {
    if (value === "") {
      setBaseAmount("");
      return;
    }
    const cleaned = value.replace(",", ".");
    if (!/^\d*\.?\d*$/.test(cleaned)) return;
    setBaseAmount(cleaned);
  };

  const price = selectedAsset?.priceUsd ?? null;

  const isCryptoToFiat = mode === "CRYPTO_TO_FIAT";

  return (
    <div className="swap-shell">
      <div className="swap-card">
        <div className="swap-tabs">
          <button className="swap-tab active" type="button">
            Swap
          </button>
        </div>

        <div className="swap-section">
          <div className="swap-section-header">
            <span>{isCryptoToFiat ? "Sell" : "Pay"}</span>
            <span style={{ color: "#6b7280" }}>
              {mode === "CRYPTO_TO_FIAT" ? "Crypto → USD" : "USD → Crypto"}
            </span>
          </div>
          <div className="swap-amount-row">
            <input
              className="swap-amount-input"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={baseAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            <select
              className="swap-token-select"
              value={selectedCode ?? ""}
              onChange={(e) => handleAssetChange(e.target.value)}
            >
              {!data && <option value="">Loading…</option>}
              {data &&
                data.map((asset) => (
                  <option key={asset.code} value={asset.code}>
                    {asset.code}
                  </option>
                ))}
            </select>
          </div>
          <div className="swap-subline">
            {isCryptoToFiat
              ? `${
                  fiatAmount
                    ? `$${fiatAmount.toFixed(2)}`
                    : price
                    ? `≈ $${price.toFixed(2)} per ${selectedAsset?.code ?? ""}`
                    : "$0"
                }`
              : cryptoAmount
              ? `${cryptoAmount.toFixed(6)} ${selectedAsset?.code ?? ""}`
              : selectedAsset
              ? `1 ${selectedAsset.code} ≈ $${price?.toFixed(2) ?? "0"}`
              : "$0"}
          </div>
        </div>

        <button
          type="button"
          className="swap-arrow-button"
          onClick={handleSwap}
          aria-label="Swap direction"
        >
          ↓
        </button>

        <div className="swap-section">
          <div className="swap-section-header">
            <span>{isCryptoToFiat ? "Buy" : "Receive"}</span>
            <span style={{ color: "#6b7280" }}>
              {isCryptoToFiat ? "USD" : selectedAsset?.code ?? "Crypto"}
            </span>
          </div>
          <div className="swap-amount-row">
            <div className="swap-amount-readonly">
              {isCryptoToFiat
                ? fiatAmount
                  ? fiatAmount.toFixed(2)
                  : "0"
                : cryptoAmount
                ? cryptoAmount.toFixed(6)
                : "0"}
            </div>
          </div>
          <div className="swap-subline">
            {price
              ? `1 ${selectedAsset?.code} ≈ $${price.toFixed(2)}`
              : "Select an asset to view its USD rate."}
          </div>
        </div>

        <button
          type="button"
          className="swap-primary-button disabled"
          disabled
        >
          Demo only – no wallet
        </button>
      </div>

      <div className="swap-side-panel">
        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Session details</div>
              <div className="panel-subtitle">
                Local-only, non-custodial demo environment licensed for assessment.
              </div>
            </div>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-label">Signed in as</div>
              <div className="hero-stat-value">{user.email}</div>
            </div>
            <div>
              <div className="hero-stat-label">Pricing source</div>
              <div className="hero-stat-value">CoinCap / static fallback</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


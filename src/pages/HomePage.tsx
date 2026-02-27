import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoAssets } from "../api/exchangeApi";
import { CryptoAsset, SortOption } from "../types/crypto";

interface HomePageProps {
  onTradeAsset?: (code: string) => void;
  onShowToast?: (message: string) => void;
}

const INITIAL_LIMIT = 10;
const PAGE_SIZE = 10;

function sortAssets(assets: CryptoAsset[], sortBy: SortOption): CryptoAsset[] {
  const copy = [...assets];
  if (sortBy === "name") {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "price") {
    copy.sort((a, b) => {
      const pa = a.priceUsd ?? Number.POSITIVE_INFINITY;
      const pb = b.priceUsd ?? Number.POSITIVE_INFINITY;
      return pa - pb;
    });
  }
  return copy;
}

export const HomePage: React.FC<HomePageProps> = ({ onTradeAsset, onShowToast }) => {
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["cryptoAssets", limit],
    queryFn: () => fetchCryptoAssets(limit),
    keepPreviousData: true
  });

  const sortedAssets = useMemo(
    () => (data ? sortAssets(data, sortBy) : []),
    [data, sortBy]
  );

  const handleLoadMore = () => {
    setLimit((prev) => prev + PAGE_SIZE);
  };

  const handleAction = (action: "buy" | "sell" | "trade", code: string) => {
    setOpenMenuFor(null);
    if (action === "trade") {
      onTradeAsset?.(code);
      onShowToast?.(`Prepared ${code} trade ticket.`);
    } else {
      const verb = action === "buy" ? "Buy" : "Sell";
      onShowToast?.(`${verb} ticket for ${code} opened (demo only).`);
    }
  };

  const renderBody = () => {
    if (isLoading && !data) {
      return <div className="empty-state">Loading market data…</div>;
    }
    if (isError) {
      return (
        <div className="empty-state">
          Failed to load assets.{" "}
          <button
            type="button"
            className="sort-button"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      );
    }
    if (!sortedAssets.length) {
      return <div className="empty-state">No assets available.</div>;
    }
    return (
      <>
        <table className="asset-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Price (USD)</th>
              <th>Rank</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sortedAssets.map((asset, index) => {
              const symbol = asset.code;
              const name = asset.name;
              const price = asset.priceUsd;
              const displayRank = index + 1;
              const isOpen = openMenuFor === symbol;
              return (
                <tr key={symbol}>
                  <td>
                    <div className="asset-main">
                      <div className="asset-icon">
                        {symbol.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="asset-name">{name}</div>
                        <div className="asset-symbol">{symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="price">
                    {price
                      ? `$${price.toLocaleString(undefined, {
                          maximumFractionDigits: 2
                        })}`
                      : "—"}
                  </td>
                  <td>
                    <span className="tag">Top {displayRank}</span>
                  </td>
                  <td>
                    <div className="dropdown">
                      <button
                        type="button"
                        className="sort-button"
                        onClick={() =>
                          setOpenMenuFor((current) =>
                            current === symbol ? null : symbol
                          )
                        }
                      >
                        Actions ▾
                      </button>
                      {isOpen && (
                        <div className="dropdown-menu">
                          <button
                            className="dropdown-item"
                            type="button"
                            onClick={() => handleAction("buy", symbol)}
                          >
                            Buy
                          </button>
                          <button
                            className="dropdown-item"
                            type="button"
                            onClick={() => handleAction("sell", symbol)}
                          >
                            Sell
                          </button>
                          <button
                            className="dropdown-item"
                            type="button"
                            onClick={() => handleAction("trade", symbol)}
                          >
                            Trade
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          type="button"
          className="load-more"
          onClick={handleLoadMore}
          disabled={isFetching}
        >
          {isFetching ? "Loading…" : "Load more assets"}
        </button>
      </>
    );
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">Market Watchlist</div>
          <div className="panel-subtitle">
            Live crypto rates via exchangerate.host (demo only).
          </div>
        </div>
        <div className="chip-row">
          <div className="chip-accent chip">Top {limit} crypto assets</div>
        </div>
      </div>

      <div className="sort-row">
        <div>Sort by</div>
        <div className="sort-buttons">
          <button
            type="button"
            className={`sort-button${sortBy === "name" ? " active" : ""}`}
            onClick={() => setSortBy("name")}
          >
            Name
          </button>
          <button
            type="button"
            className={`sort-button${sortBy === "price" ? " active" : ""}`}
            onClick={() => setSortBy("price")}
          >
            Price
          </button>
        </div>
      </div>

      <div className="table-wrapper">{renderBody()}</div>
    </div>
  );
};


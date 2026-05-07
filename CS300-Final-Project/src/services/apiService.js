const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1";

export const fetchPublicDataset = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch the public dataset.");
  }
  const items = await response.json(); // CoinGecko returns an array directly

  return items.map((item) => ({
    rank: item.market_cap_rank,
    name: item.name,
    symbol: item.symbol.toUpperCase(),
    priceUsd: item.current_price,
    marketCapUsd: item.market_cap,
    volumeUsd24Hr: item.total_volume,
  }));
};
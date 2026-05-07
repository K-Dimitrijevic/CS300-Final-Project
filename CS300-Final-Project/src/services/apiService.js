const API_URL = "https://api.coincap.io/v2/assets?limit=20";

export const fetchPublicDataset = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch the public dataset.");
  }
  const payload = await response.json();
  const items = payload?.data ?? [];

  return items.map((item) => ({
    rank: Number(item.rank),
    name: item.name,
    symbol: item.symbol,
    priceUsd: Number(item.priceUsd),
    marketCapUsd: Number(item.marketCapUsd),
    volumeUsd24Hr: Number(item.volumeUsd24Hr),
  }));
};

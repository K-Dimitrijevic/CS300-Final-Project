const toNumberIfNumeric = (value) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  const numericValue = Number(trimmed);
  return Number.isFinite(numericValue) ? numericValue : value;
};

export const normalizeData = (data) =>
  data.map((row) =>
    Object.entries(row).reduce((acc, [key, value]) => {
      acc[key] = toNumberIfNumeric(value);
      return acc;
    }, {})
  );

export const getFields = (data) =>
  data.length ? Object.keys(data[0]) : [];

export const getNumericFields = (data) =>
  getFields(data).filter((field) =>
    data.some((row) => Number.isFinite(Number(row[field])))
  );

export const calculateStats = (data, field) => {
  if (!field) return null;
  const values = data
    .map((row) => Number(row[field]))
    .filter((value) => Number.isFinite(value));

  if (!values.length) return null;

  const total = values.reduce((sum, value) => sum + value, 0);
  const avg = total / values.length;
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg,
    total,
  };
};

export const filterData = (data, query) => {
  if (!query) return data;
  const lowered = query.toLowerCase();
  return data.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(lowered)
  );
};

export const sortData = (data, field, direction) => {
  if (!field) return data;
  const multiplier = direction === "desc" ? -1 : 1;
  return [...data].sort((a, b) => {
    const left = a[field];
    const right = b[field];
    if (left === right) return 0;
    if (left === undefined) return 1;
    if (right === undefined) return -1;
    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * multiplier;
    }
    return String(left).localeCompare(String(right)) * multiplier;
  });
};

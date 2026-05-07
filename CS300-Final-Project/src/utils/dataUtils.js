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

export const filterValidRows = (data) =>
  Array.isArray(data)
    ? data.filter((row) => row && typeof row === "object" && !Array.isArray(row))
    : [];

export const getNumericFields = (data) =>
  getFields(data).filter((field) =>
    data.some((row) => Number.isFinite(Number(row[field])))
  );

export const getNumericPairs = (data, xField, yField) => {
  if (!xField || !yField) return [];
  return data
    .map((row) => [Number(row[xField]), Number(row[yField])])
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y))
    .map(([x, y]) => ({ x, y }));
};

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

export const getNumericValues = (data, field) => {
  if (!field) return [];
  return data
    .map((row) => Number(row[field]))
    .filter((value) => Number.isFinite(value));
};

const getMedian = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

const getMode = (values) => {
  if (!values.length) return null;
  const counts = new Map();
  values.forEach((value) => {
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  let mode = null;
  let maxCount = 1;
  counts.forEach((count, value) => {
    if (count > maxCount) {
      maxCount = count;
      mode = value;
    }
  });
  return mode;
};

const getQuartiles = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const lowerHalf = sorted.slice(0, mid);
  const upperHalf = sorted.length % 2 === 0
    ? sorted.slice(mid)
    : sorted.slice(mid + 1);

  const q1 = getMedian(lowerHalf);
  const q2 = getMedian(sorted);
  const q3 = getMedian(upperHalf);
  return { q1, q2, q3 };
};

export const calculateDetailedStats = (data, field) => {
  const values = getNumericValues(data, field);
  if (!values.length) return null;

  const count = values.length;
  const sum = values.reduce((total, value) => total + value, 0);
  const mean = sum / count;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const variance =
    count > 1
      ? values.reduce((acc, value) => acc + (value - mean) ** 2, 0) / (count - 1)
      : 0;
  const standardDeviation = Math.sqrt(variance);
  const median = getMedian(values);
  const mode = getMode(values);
  const quartiles = getQuartiles(values);
  const interquartileRange =
    quartiles && quartiles.q1 !== null && quartiles.q3 !== null
      ? quartiles.q3 - quartiles.q1
      : null;

  const skewness =
    count > 2 && standardDeviation > 0
      ? (count / ((count - 1) * (count - 2))) *
        values.reduce(
          (acc, value) => acc + ((value - mean) / standardDeviation) ** 3,
          0
        )
      : null;

  return {
    count,
    sum,
    mean,
    median,
    mode,
    min,
    max,
    range,
    variance,
    standardDeviation,
    quartiles,
    interquartileRange,
    skewness,
  };
};

export const calculateCorrelation = (data, fieldA, fieldB) => {
  if (!fieldA || !fieldB) return null;
  const pairs = data
    .map((row) => [Number(row[fieldA]), Number(row[fieldB])])
    .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
  if (pairs.length < 2) return null;

  const count = pairs.length;
  const meanA = pairs.reduce((sum, [a]) => sum + a, 0) / count;
  const meanB = pairs.reduce((sum, [, b]) => sum + b, 0) / count;
  let numerator = 0;
  let denomA = 0;
  let denomB = 0;
  pairs.forEach(([a, b]) => {
    const diffA = a - meanA;
    const diffB = b - meanB;
    numerator += diffA * diffB;
    denomA += diffA ** 2;
    denomB += diffB ** 2;
  });
  const denominator = Math.sqrt(denomA * denomB);
  if (!denominator) return null;
  return numerator / denominator;
};

const parseXValue = (value) => {
  if (Number.isFinite(Number(value))) {
    return Number(value);
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const calculateTrendline = (data, xField, yField) => {
  if (!xField || !yField) return null;
  const points = data
    .map((row) => [parseXValue(row[xField]), Number(row[yField])])
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));

  if (points.length < 2) return null;

  const count = points.length;
  const meanX = points.reduce((sum, [x]) => sum + x, 0) / count;
  const meanY = points.reduce((sum, [, y]) => sum + y, 0) / count;

  let numerator = 0;
  let denominator = 0;
  points.forEach(([x, y]) => {
    numerator += (x - meanX) * (y - meanY);
    denominator += (x - meanX) ** 2;
  });

  if (!denominator) return null;

  // Simple linear regression for trendline
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  const totalSumSquares = points.reduce(
    (sum, [, y]) => sum + (y - meanY) ** 2,
    0
  );
  const residualSumSquares = points.reduce((sum, [x, y]) => {
    const predicted = slope * x + intercept;
    return sum + (y - predicted) ** 2;
  }, 0);
  const r2 = totalSumSquares
    ? 1 - residualSumSquares / totalSumSquares
    : null;

  return { slope, intercept, r2 };
};

export const calculateRegressionLine = (data, xField, yField) => {
  if (!xField || !yField) return null;
  const points = getNumericPairs(data, xField, yField);

  if (points.length < 3) return null;

  const count = points.length;
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / count;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / count;

  let numerator = 0;
  let denominator = 0;
  points.forEach(({ x, y }) => {
    numerator += (x - meanX) * (y - meanY);
    denominator += (x - meanX) ** 2;
  });

  if (!denominator) return null;

  // Least-squares regression line
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  const totalSumSquares = points.reduce(
    (sum, point) => sum + (point.y - meanY) ** 2,
    0
  );
  const residualSumSquares = points.reduce((sum, { x, y }) => {
    const predicted = slope * x + intercept;
    return sum + (y - predicted) ** 2;
  }, 0);
  const r2 = totalSumSquares
    ? 1 - residualSumSquares / totalSumSquares
    : null;

  const xs = points.map((point) => point.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const linePoints = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];

  return { slope, intercept, r2, points: linePoints };
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

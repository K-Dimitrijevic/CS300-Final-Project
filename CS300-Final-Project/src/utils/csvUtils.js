const splitCSVLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

export const parseCSVToObjects = (text) => {
  const rows = text.trim().split(/\r?\n/).filter(Boolean);
  if (!rows.length) return [];

  const headers = splitCSVLine(rows[0]);
  return rows.slice(1).map((row) => {
    const values = splitCSVLine(row);
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });
};

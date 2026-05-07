export const buildInsightsSummary = ({
  datasetName,
  xField,
  yField,
  yField2,
  stats,
  correlation,
  trendline,
}) => ({
  datasetName: datasetName || "Untitled dataset",
  field: yField,
  compareField: yField2 || null,
  xField: xField || null,
  stats,
  correlation,
  trendline,
  generatedAt: new Date().toISOString(),
});

export const downloadInsightsSummary = (summary) => {
  const blob = new Blob([JSON.stringify(summary, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dataset-insights.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

import Button from "./Button";
import Card from "./Card";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";
import LoadingSpinner from "./LoadingSpinner";
import {
  calculateCorrelation,
  calculateDetailedStats,
  calculateTrendline,
} from "../utils/dataUtils";
import {
  buildInsightsSummary,
  downloadInsightsSummary,
} from "../utils/insightsUtils";

const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
};

const DatasetInsights = ({
  data,
  datasetName,
  xField,
  yField,
  yField2,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Card title="Dataset insights">
        <LoadingSpinner label="Calculating insights" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Dataset insights">
        <ErrorAlert message={error} />
      </Card>
    );
  }

  if (!data?.length || !yField) {
    return (
      <Card title="Dataset insights">
        <EmptyState
          title="No insights available"
          description="Choose a dataset and a numeric field to see analytics here."
        />
      </Card>
    );
  }

  const stats = calculateDetailedStats(data, yField);
  if (!stats) {
    return (
      <Card title="Dataset insights">
        <EmptyState
          title="Not enough numeric data"
          description="Select a field with numeric values to calculate insights."
        />
      </Card>
    );
  }

  const correlation = yField2
    ? calculateCorrelation(data, yField, yField2)
    : null;
  const trendline = calculateTrendline(data, xField, yField);

  const metrics = [
    {
      label: "Count",
      value: stats.count,
      description: "Number of valid numeric entries in this field.",
    },
    {
      label: "Sum",
      value: stats.sum,
      description: "Total of all values in the selected field.",
    },
    {
      label: "Mean",
      value: stats.mean,
      description: "Average value across the dataset.",
    },
    {
      label: "Median",
      value: stats.median,
      description: "Middle value after sorting the data.",
    },
    {
      label: "Mode",
      value: stats.mode ?? "No mode",
      description: "Most frequently occurring value.",
    },
    {
      label: "Minimum",
      value: stats.min,
      description: "Smallest observed value.",
    },
    {
      label: "Maximum",
      value: stats.max,
      description: "Largest observed value.",
    },
    {
      label: "Range",
      value: stats.range,
      description: "Spread between the maximum and minimum values.",
    },
    {
      label: "Variance",
      value: stats.variance,
      description: "How far values vary from the mean.",
    },
    {
      label: "Standard deviation",
      value: stats.standardDeviation,
      description: "Typical distance from the mean.",
    },
    {
      label: "Quartile Q1",
      value: stats.quartiles?.q1,
      description: "Lower quartile (25% of values are below this).",
    },
    {
      label: "Quartile Q2",
      value: stats.quartiles?.q2,
      description: "Median (50% of values are below this).",
    },
    {
      label: "Quartile Q3",
      value: stats.quartiles?.q3,
      description: "Upper quartile (75% of values are below this).",
    },
    {
      label: "Interquartile range",
      value: stats.interquartileRange,
      description: "Spread of the middle 50% of values.",
    },
    {
      label: "Skewness",
      value: stats.skewness,
      description: "Indicates whether the distribution leans left or right.",
    },
  ];

  const handleExport = () => {
    const summary = buildInsightsSummary({
      datasetName,
      xField,
      yField,
      yField2,
      stats,
      correlation,
      trendline,
    });
    downloadInsightsSummary(summary);
  };

  return (
    <Card
      title="Dataset insights"
      subtitle={datasetName ? `${datasetName} · ${yField}` : yField}
    >
      <div className="insights__intro">
        <p>
          <strong>Field:</strong> {yField} tracks numeric values in your dataset.
          These insights summarize how the field behaves and how it supports the
          current chart.
        </p>
        <p>
          <strong>Values:</strong> Each number represents a single record in the
          dataset, helping you compare scale and trends.
        </p>
        <div className="insights__actions">
          <Button variant="ghost" onClick={handleExport}>
            Export insights
          </Button>
        </div>
      </div>

      <div className="insights__grid">
        {metrics.map((metric) => (
          <div key={metric.label} className="insights__item">
            <h4>{metric.label}</h4>
            <span>{formatNumber(metric.value)}</span>
            <p>{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="insights__extra">
        <div>
          <h4>Correlation</h4>
          <p>
            {yField2
              ? `Relationship between ${yField} and ${yField2}: ${formatNumber(
                  correlation
                )}`
              : "Select a second numeric field to see correlation."}
          </p>
        </div>
        <div>
          <h4>Trendline</h4>
          <p>
            {trendline?.r2 !== null && trendline?.r2 !== undefined
              ? `Trendline R²: ${formatNumber(trendline.r2)} · Slope: ${formatNumber(
                  trendline.slope
                )}`
              : "Trendline metrics appear when the x-axis is numeric or date-based."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DatasetInsights;

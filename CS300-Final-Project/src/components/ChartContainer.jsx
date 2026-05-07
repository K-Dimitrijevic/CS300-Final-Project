import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from "recharts";

import EmptyState from "./EmptyState";

const COLORS = [
  "#3f8efc",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#14b8a6",
];

const ChartContainer = ({
  data,
  xField,
  yField,
  yField2,
  chartType,
  regressionLine,
  showRegression,
}) => { console.log("yField2:", yField2);
  if (!data?.length || !xField || !yField) {
    return (
      <EmptyState
        title="Select fields to visualize"
        description="Pick an x-axis and y-axis field to see the chart update."
      />
    );
  }

  const scatterData = data
    .map((row, index) => ({
      x: Number(row[xField]),
      y: Number(row[yField]),
      label:
        row.label ||
        row.name ||
        row.title ||
        row.id ||
        row.category ||
        row[xField] ||
        `Point ${index + 1}`,
    }))
    .filter(
      (point) =>
        Number.isFinite(point.x) &&
        Number.isFinite(point.y)
    );

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={320}>
        {chartType === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yField} stroke="#3f8efc" />
            {yField2 && yField2 !== yField ? (
              <Line type="monotone" dataKey={yField2} stroke="#f97316" />
            ) : null}
          </LineChart>
        ) : chartType === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yField} fill="#22c55e" />
            {yField2 && yField2 !== yField ? (
              <Bar dataKey={yField2} fill="#f97316" />
            ) : null}
          </BarChart>
        ) : chartType === "area" ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={yField} stroke="#a855f7" fill="#c4b5fd" />
            {yField2 && yField2 !== yField ? (
              <Area type="monotone" dataKey={yField2} stroke="#f97316" fill="#fed7aa" />
            ) : null}
          </AreaChart>
        ) : chartType === "pie" ? (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={yField}
              nameKey={xField}
              outerRadius={120}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${entry[xField]}-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        ) : chartType === "scatter" ? (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name={xField} />
            <YAxis type="number" dataKey="y" name={yField} />
            <Tooltip
              formatter={(value, name) => [value, name]}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.label || ""
              }
            />
            <Legend />
            <Scatter
              name={yField}
              data={scatterData}
              shape={(props) => (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={2.5}
                  fill="#2563eb"
                  opacity={0.7}
                  stroke="#1e3a8a"
                  strokeWidth={0.5}
                />
              )}
            />
            {showRegression && regressionLine?.points?.length === 2 ? (
              <ReferenceLine
                segment={regressionLine.points}
                stroke="#f97316"
                strokeWidth={2}
              />
            ) : null}
          </ScatterChart>
        ) : null}
      </ResponsiveContainer>

      {chartType === "scatter" && showRegression && regressionLine && (
        <div className="regression-stats">
          <span>
            y = {regressionLine.slope?.toFixed(4)}x +
            {regressionLine.intercept?.toFixed(4)}
          </span>
          <span style={{ marginLeft: "1rem" }}>
            R² = {regressionLine.r2?.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ChartContainer;
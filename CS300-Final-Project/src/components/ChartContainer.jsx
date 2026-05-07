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
} from "recharts";
import EmptyState from "./EmptyState";

const COLORS = ["#3f8efc", "#22c55e", "#f97316", "#a855f7", "#14b8a6"];

const ChartContainer = ({ data, xField, yField, chartType }) => {
  if (!data?.length || !xField || !yField) {
    return (
      <EmptyState
        title="Select fields to visualize"
        description="Pick an x-axis and y-axis field to see the chart update."
      />
    );
  }

  const commonProps = { data };

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={320}>
        {chartType === "line" && (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yField} stroke="#3f8efc" />
          </LineChart>
        )}
        {chartType === "bar" && (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yField} fill="#22c55e" />
          </BarChart>
        )}
        {chartType === "area" && (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={yField} stroke="#a855f7" fill="#c4b5fd" />
          </AreaChart>
        )}
        {chartType === "pie" && (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie data={data} dataKey={yField} nameKey={xField} outerRadius={120}>
              {data.map((entry, index) => (
                <Cell key={`${entry[xField]}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContainer;

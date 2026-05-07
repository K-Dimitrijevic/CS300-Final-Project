import { NavLink, useParams } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import ChartContainer from "../components/ChartContainer";
import DatasetStats from "../components/DatasetStats";
import DatasetTable from "../components/DatasetTable";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SelectField from "../components/SelectField";
import { calculateStats, filterData, getFields, sortData } from "../utils/dataUtils";

const DatasetDetails = ({ datasets }) => {
  const { id } = useParams();
  const dataset = datasets.find((item) => item.id === id);
  const [chartType, setChartType] = useState("line");
  const [xField, setXField] = useState("");
  const [yField, setYField] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const fields = dataset?.fields?.length
    ? dataset.fields
    : getFields(dataset?.data || []);

  const safeXField = fields.includes(xField) ? xField : fields[0] || "";
  const safeYField = fields.includes(yField) ? yField : fields[1] || fields[0] || "";

  const baseData = dataset?.data || [];
  const filteredData = sortData(
    filterData(baseData, filterQuery),
    sortField,
    sortDirection
  );
  const stats = calculateStats(filteredData, safeYField);

  if (!dataset) {
    return (
      <div className="page">
        <EmptyState
          title="Dataset not found"
          description="Return to Saved Datasets to pick another entry."
        />
        <NavLink to="/saved">
          <Button>Back to saved datasets</Button>
        </NavLink>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title={dataset.name}
        subtitle={`Created ${new Date(dataset.createdAt).toLocaleString()}`}
      >
        <NavLink to="/dashboard">
          <Button variant="ghost">Open in dashboard</Button>
        </NavLink>
      </PageHeader>

      <Card title="Visualization settings">
        <div className="grid grid--three">
          <SelectField
            label="Chart type"
            value={chartType}
            onChange={setChartType}
            options={[
              { value: "bar", label: "Bar chart" },
              { value: "line", label: "Line chart" },
              { value: "area", label: "Area chart" },
              { value: "pie", label: "Pie chart" },
            ]}
          />
          <SelectField
            label="X-axis"
            value={safeXField}
            onChange={setXField}
            options={fields.map((field) => ({ value: field, label: field }))}
          />
          <SelectField
            label="Y-axis"
            value={safeYField}
            onChange={setYField}
            options={fields.map((field) => ({ value: field, label: field }))}
          />
          <SelectField
            label="Sort"
            value={`${sortField}|${sortDirection}`}
            onChange={(value) => {
              const [field, direction] = value.split("|");
              setSortField(field);
              setSortDirection(direction);
            }}
            options={[
              { value: "|asc", label: "No sorting" },
              ...fields.map((field) => ({
                value: `${field}|asc`,
                label: `${field} (A → Z)`,
              })),
              ...fields.map((field) => ({
                value: `${field}|desc`,
                label: `${field} (Z → A)`,
              })),
            ]}
          />
          <label className="field">
            <span>Filter rows</span>
            <input
              value={filterQuery}
              onChange={(event) => setFilterQuery(event.target.value)}
              placeholder="Search any value"
            />
          </label>
        </div>
      </Card>

      <div className="grid grid--two">
        <Card title="Chart preview">
          <ChartContainer
            data={filteredData}
            xField={safeXField}
            yField={safeYField}
            chartType={chartType}
          />
        </Card>
        <Card title="Dataset stats" subtitle={`Field: ${safeYField || "-"}`}>
          <DatasetStats stats={stats} />
          <DatasetTable data={filteredData} fields={fields} />
        </Card>
      </div>
    </div>
  );
};

export default DatasetDetails;

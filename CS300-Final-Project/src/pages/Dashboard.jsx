import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import ChartContainer from "../components/ChartContainer";
import DatasetStats from "../components/DatasetStats";
import DatasetTable from "../components/DatasetTable";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import SelectField from "../components/SelectField";
import useFetchDataset from "../hooks/useFetchDataset";
import { calculateStats, filterData, getFields, sortData } from "../utils/dataUtils";

const Dashboard = ({ datasets, onSaveDataset }) => {
  const { data: apiData, loading, error, refetch } = useFetchDataset();
  const [selectedId, setSelectedId] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [xField, setXField] = useState("");
  const [yField, setYField] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const activeDataset = selectedId === "api"
    ? {
        id: "api",
        name: "Market Snapshot (API)",
        data: apiData,
        fields: getFields(apiData),
      }
    : datasets.find((dataset) => dataset.id === selectedId) || null;

  const fields = activeDataset?.fields?.length
    ? activeDataset.fields
    : getFields(activeDataset?.data || []);

  const safeXField = fields.includes(xField) ? xField : fields[0] || "";
  const safeYField = fields.includes(yField) ? yField : fields[1] || fields[0] || "";

  const baseData = activeDataset?.data || [];
  const filteredData = sortData(
    filterData(baseData, filterQuery),
    sortField,
    sortDirection
  );
  const stats = calculateStats(filteredData, safeYField);

  const handleSaveApi = () => {
    if (!apiData.length) return;
    const id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    onSaveDataset({
      id,
      name: "Market Snapshot (API)",
      createdAt: new Date().toISOString(),
      data: apiData,
      fields: getFields(apiData),
      xField: safeXField,
      yField: safeYField,
    });
  };

  const datasetOptions = [
    { value: "", label: "Select a dataset" },
    ...datasets.map((dataset) => ({ value: dataset.id, label: dataset.name })),
    { value: "api", label: "Public API · Market Snapshot" },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Visualization Dashboard"
        subtitle="Switch datasets, configure axes, and explore charts."
      >
        <div className="button-row">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedId("api");
              refetch();
            }}
          >
            Load public dataset
          </Button>
          {selectedId === "api" && apiData.length > 0 && (
            <Button onClick={handleSaveApi}>Save API dataset</Button>
          )}
        </div>
      </PageHeader>

      {loading && <LoadingSpinner label="Fetching API data" />}
      {error && <ErrorAlert message={error} />}

      <Card title="Dataset controls">
        <div className="grid grid--three">
          <SelectField
            label="Dataset"
            value={selectedId}
            onChange={setSelectedId}
            options={datasetOptions}
          />
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

      {!activeDataset && (
        <EmptyState
          title="Choose a dataset to begin"
          description="Load a saved dataset or fetch the public API sample."
        />
      )}

      {activeDataset && (
        <div className="grid grid--two">
          <Card title="Chart preview" subtitle={activeDataset.name}>
            <ChartContainer
              data={filteredData}
              xField={safeXField}
              yField={safeYField}
              chartType={chartType}
            />
          </Card>
          <Card title="Statistics" subtitle={`Field: ${safeYField || "-"}`}>
            <DatasetStats stats={stats} />
            <DatasetTable data={filteredData} fields={fields} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

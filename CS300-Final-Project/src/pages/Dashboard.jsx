import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import ChartContainer from "../components/ChartContainer";
import DatasetInsights from "../components/DatasetInsights";
import DatasetStats from "../components/DatasetStats";
import DatasetTable from "../components/DatasetTable";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import SelectField from "../components/SelectField";
import useChartConfig from "../hooks/useChartConfig";
import useFetchDataset from "../hooks/useFetchDataset";
import {
  calculateStats,
  getFields,
  getNumericFields,
} from "../utils/dataUtils";

const Dashboard = ({ datasets, onSaveDataset }) => {
  const { data: apiData, loading, error, refetch } = useFetchDataset();
  const [selectedId, setSelectedId] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [xField, setXField] = useState("");
  const [yField, setYField] = useState("");
  const [yField2, setYField2] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const activeDataset = selectedId === "api"
    ? (apiData.length > 0 && !loading)
      ? { id: "api", name: "Market Snapshot (API)", data: apiData, fields: getFields(apiData) }
      : null 
    : datasets.find((dataset) => dataset.id === selectedId) || null;

  const rawData = Array.isArray(activeDataset?.data) ? activeDataset.data : [];
  const fields = activeDataset?.fields?.length
    ? activeDataset.fields
    : getFields(rawData);
  const numericFields = getNumericFields(rawData);
  const numericOptions = numericFields.length
    ? numericFields.map((field) => ({ value: field, label: field }))
    : [{ value: "", label: "No numeric fields" }];

  const safeYField2 = numericFields.includes(yField2) ? yField2 : "";
  const {
    safeXField,
    safeYField,
    filteredData,
    effectiveChartType,
    regressionLine,
    showRegression,
    regressionMessage,
    chartNote,
  } = useChartConfig({
    data: rawData,
    fields,
    numericFields,
    chartType,
    xField,
    yField,
    filterQuery,
    sortField,
    sortDirection,
  });
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
            onChange={(value) => {
              setSelectedId(value);
              if (value === "api") refetch();
                }}
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
              { value: "scatter", label: "Scatter plot" },
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
            options={numericOptions}
          />
          <SelectField
            label="Compare field"
            value={safeYField2}
            onChange={setYField2}
            options={[
              { value: "", label: "Optional" },
              ...numericOptions,
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

      {!activeDataset && !loading && (
        <EmptyState
          title="Choose a dataset to begin"
          description="Load a saved dataset or fetch the public API sample."
        />
      )}

      {activeDataset && (
        <>
          <div className="grid grid--two">
            <Card title="Chart preview" subtitle={activeDataset.name}>
              {chartNote && <p className="chart-note">{chartNote}</p>}
              {regressionMessage && (
                <p className="chart-note chart-note--warning">
                  {regressionMessage}
                </p>
              )}
              <ChartContainer
                data={filteredData}
                xField={safeXField}
                yField={safeYField}
                yField2={safeYField2}
                chartType={effectiveChartType}
                regressionLine={regressionLine}
                showRegression={showRegression}
              />
          
            </Card>
            <Card title="Statistics" subtitle={`Field: ${safeYField || "-"}`}>
              <DatasetStats stats={stats} />
              <DatasetTable data={filteredData} fields={fields} />
            </Card>
          </div>
          <DatasetInsights
            data={filteredData}
            datasetName={activeDataset.name}
            xField={safeXField}
            yField={safeYField}
            yField2={safeYField2}
            loading={loading && selectedId === "api"}
            error={selectedId === "api" ? error : null}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;

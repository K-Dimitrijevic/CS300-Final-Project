import { NavLink, useParams } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import ChartContainer from "../components/ChartContainer";
import DatasetInsights from "../components/DatasetInsights";
import DatasetStats from "../components/DatasetStats";
import DatasetTable from "../components/DatasetTable";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SelectField from "../components/SelectField";
import useChartConfig from "../hooks/useChartConfig";
import {
  calculateStats,
  getFields,
  getNumericFields,
} from "../utils/dataUtils";

const DatasetDetails = ({ datasets }) => {
  const { id } = useParams();
  const dataset = datasets.find((item) => item.id === id);
  const [chartType, setChartType] = useState("line");
  const [xField, setXField] = useState("");
  const [yField, setYField] = useState("");
  const [yField2, setYField2] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const rawData = Array.isArray(dataset?.data) ? dataset.data : [];
  const fields = dataset?.fields?.length
    ? dataset.fields
    : getFields(rawData);
  const numericFields = getNumericFields(rawData);
  const dataInvalid = dataset && !Array.isArray(dataset.data);
  const numericOptions = numericFields.length
    ? numericFields.map((field) => ({ value: field, label: field }))
    : [{ value: "", label: "No numeric fields" }];

  const safeYField2 = numericFields.includes(yField2) ? yField2 : "";
  console.log("safeYField2:", safeYField2, "yField2:", yField2, "numericFields:", numericFields);
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

  if (dataInvalid) {
    return (
      <div className="page">
        <EmptyState
          title="Dataset is unavailable"
          description="This dataset doesn't contain a valid list of rows. Try saving it again."
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
              { value: "scatter", label: "Scatter plot" },
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
            value={yField2}
            onChange={setYField2}
            options={[
              { value: "", label: "Optional" },
              ...numericOptions,
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
        <Card title="Dataset stats" subtitle={`Field: ${safeYField || "-"}`}>
          <DatasetStats stats={stats} />
          <DatasetTable data={filteredData} fields={fields} />
        </Card>
      </div>
      <DatasetInsights
        data={filteredData}
        datasetName={dataset.name}
        xField={safeXField}
        yField={safeYField}
        yField2={safeYField2}
        loading={false}
        error={null}
      />
    </div>
  );
};

export default DatasetDetails;

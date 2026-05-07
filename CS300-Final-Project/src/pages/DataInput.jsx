import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import DatasetStats from "../components/DatasetStats";
import DatasetTable from "../components/DatasetTable";
import ErrorAlert from "../components/ErrorAlert";
import FileUpload from "../components/FileUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import SelectField from "../components/SelectField";
import TextAreaField from "../components/TextAreaField";
import { parseCSVToObjects } from "../utils/csvUtils";
import {
  calculateStats,
  getFields,
  getNumericFields,
  normalizeData,
} from "../utils/dataUtils";

const parseJsonDataset = (text) => {
  const parsed = JSON.parse(text);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.data)) return parsed.data;
  if (Array.isArray(parsed?.items)) return parsed.items;
  return [];
};

const DataInput = ({ onSaveDataset }) => {
  const [datasetName, setDatasetName] = useState("");
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [fields, setFields] = useState([]);
  const [xField, setXField] = useState("");
  const [yField, setYField] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const text = file ? await file.text() : rawText;
      if (!text.trim()) {
        throw new Error("Add JSON in the textarea or upload a file.");
      }

      const isCsv = file
        ? file.name.toLowerCase().endsWith(".csv")
        : false;
      const data = isCsv ? parseCSVToObjects(text) : parseJsonDataset(text);

      if (!Array.isArray(data) || !data.length) {
        throw new Error("The dataset should be an array of objects.");
      }

      const normalized = normalizeData(data);
      const fieldList = getFields(normalized);
      const numericFields = getNumericFields(normalized);

      setParsedData(normalized);
      setFields(fieldList);
      setXField(fieldList[0] || "");
      setYField(numericFields[0] || fieldList[0] || "");
    } catch (err) {
      setError(err?.message || "Unable to parse the dataset.");
      setParsedData([]);
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!parsedData.length) {
      setError("Analyze a dataset before saving.");
      return;
    }
    if (!datasetName.trim()) {
      setError("Give your dataset a name.");
      return;
    }

    const id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    onSaveDataset({
      id,
      name: datasetName.trim(),
      createdAt: new Date().toISOString(),
      data: parsedData,
      fields,
      xField,
      yField,
    });

    setDatasetName("");
    setRawText("");
    setFile(null);
    setParsedData([]);
    setFields([]);
    setXField("");
    setYField("");
  };

  const stats =
    parsedData.length && yField ? calculateStats(parsedData, yField) : null;

  return (
    <div className="page">
      <PageHeader
        title="Data Input"
        subtitle="Paste JSON or upload CSV/JSON files to start visualizing."
      />

      <div className="grid grid--two">
        <Card title="Paste JSON">
          <TextAreaField
            label="Dataset JSON"
            value={rawText}
            onChange={setRawText}
            placeholder='[{"name": "Q1", "sales": 120}]'
            helper="We expect an array of objects or { data: [...] }."
          />
          <div className="button-row">
            <Button onClick={handleAnalyze}>Analyze</Button>
            <Button variant="ghost" onClick={() => setRawText("")}>
              Clear
            </Button>
          </div>
        </Card>

        <Card title="Upload file">
          <FileUpload
            label="CSV or JSON file"
            accept=".csv,.json,application/json,text/csv"
            onFile={setFile}
          />
          <p className="helper">Upload a file and hit Analyze to parse it.</p>
          <Button onClick={handleAnalyze}>Analyze upload</Button>
        </Card>
      </div>

      {loading && <LoadingSpinner label="Parsing data" />}
      {error && <ErrorAlert message={error} />}

      {parsedData.length > 0 && (
        <Card
          title="Dataset preview"
          subtitle="Review fields and save when ready."
        >
          <div className="grid grid--three">
            <SelectField
              label="X-axis field"
              value={xField}
              onChange={setXField}
              options={fields.map((field) => ({
                value: field,
                label: field,
              }))}
            />
            <SelectField
              label="Y-axis field"
              value={yField}
              onChange={setYField}
              options={fields.map((field) => ({
                value: field,
                label: field,
              }))}
            />
            <label className="field">
              <span>Dataset name</span>
              <input
                value={datasetName}
                onChange={(event) => setDatasetName(event.target.value)}
                placeholder="e.g., Quarterly Sales"
              />
            </label>
          </div>

          <DatasetStats stats={stats} />
          <DatasetTable data={parsedData} fields={fields} />

          <Button onClick={handleSave}>Save dataset</Button>
        </Card>
      )}
    </div>
  );
};

export default DataInput;

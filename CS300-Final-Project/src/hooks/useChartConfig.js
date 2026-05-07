import {
  calculateRegressionLine,
  filterData,
  sortData,
} from "../utils/dataUtils";

const useChartConfig = ({
  data,
  fields,
  numericFields,
  chartType,
  xField,
  yField,
  filterQuery,
  sortField,
  sortDirection,
}) => {
  const safeXField = fields.includes(xField) ? xField : fields[0] || "";
  const safeYField = numericFields.includes(yField)
    ? yField
    : numericFields[0] || "";
  const baseData = Array.isArray(data) ? data : [];
  const filteredData = sortData(
    filterData(baseData, filterQuery),
    sortField,
    sortDirection
  );

  const isNumericX = numericFields.includes(safeXField);
  const isNumericY = numericFields.includes(safeYField);
  const shouldUseScatter = isNumericX && isNumericY;
  const effectiveChartType = shouldUseScatter ? "scatter" : chartType;
  const regressionLine = shouldUseScatter
    ? calculateRegressionLine(filteredData, safeXField, safeYField)
    : null;
  const showRegression = shouldUseScatter && Boolean(regressionLine);

  const regressionMessage = !isNumericX && safeXField
    ? "Regression disabled: X-axis is categorical."
    : !isNumericY && safeYField
    ? "Regression disabled: Y-axis is not numeric."
    : null;

  const chartNote = shouldUseScatter && chartType !== "scatter"
    ? "Numeric X and Y fields detected. Switched to a scatter plot to show regression analysis."
    : null;

  return {
    safeXField,
    safeYField,
    filteredData,
    effectiveChartType,
    regressionLine,
    showRegression,
    regressionMessage,
    chartNote,
  };
};

export default useChartConfig;

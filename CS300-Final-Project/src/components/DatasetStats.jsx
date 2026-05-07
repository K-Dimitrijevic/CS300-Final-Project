const formatNumber = (value) =>
  Number.isFinite(value) ? value.toLocaleString() : "-";

const DatasetStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="stats">
      <div>
        <span>Minimum</span>
        <strong>{formatNumber(stats.min)}</strong>
      </div>
      <div>
        <span>Maximum</span>
        <strong>{formatNumber(stats.max)}</strong>
      </div>
      <div>
        <span>Average</span>
        <strong>{formatNumber(stats.avg)}</strong>
      </div>
      <div>
        <span>Total</span>
        <strong>{formatNumber(stats.total)}</strong>
      </div>
    </div>
  );
};

export default DatasetStats;

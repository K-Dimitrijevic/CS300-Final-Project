import { useState } from "react";

const DatasetTable = ({ data, fields, limit = 10 }) => {
  const [visibleCount, setVisibleCount] = useState(limit);
  if (!data?.length) return null;
  const rows = data.slice(0, visibleCount);
  const canShowMore = visibleCount < data.length;

  return (
    <div className="table">
      <div className="table__scroll">
        <table>
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field}>{field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row[fields[0]]}-${index}`}>
                {fields.map((field) => (
                  <td key={`${field}-${index}`}>{String(row[field])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table__footer">
        <p className="table__caption">
          Showing {rows.length} of {data.length} rows.
        </p>
        <div className="table__actions">
          {canShowMore && (
            <button
              type="button"
              className="table__button"
              onClick={() => setVisibleCount((count) => count + limit)}
            >
              Show {limit} more
            </button>
          )}
          {visibleCount > limit && (
            <button
              type="button"
              className="table__button"
              onClick={() => setVisibleCount(limit)}
            >
              Show less
            </button>
          )}
          {data.length > limit && (
            <button
              type="button"
              className="table__button"
              onClick={() => setVisibleCount(data.length)}
            >
              Show all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetTable;

const DatasetTable = ({ data, fields, limit = 10 }) => {
  if (!data?.length) return null;

  const rows = data.slice(0, limit);

  return (
    <div className="table">
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
      <p className="table__caption">Showing {rows.length} of {data.length} rows.</p>
    </div>
  );
};

export default DatasetTable;

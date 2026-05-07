import { NavLink } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";

const SavedDatasets = ({ datasets = [], onDeleteDataset }) => (
  <div className="page">
    <PageHeader
      title="Saved Datasets"
      subtitle="Manage datasets stored in your browser."
    />

    {!datasets.length && (
      <EmptyState
        title="No saved datasets"
        description="Save a dataset from the Data Input page to see it here."
      />
    )}

    <div className="grid">
      {datasets.map((dataset) => (
        <Card
          key={dataset.id}
          title={dataset.name}
          subtitle={`Created ${new Date(dataset.createdAt).toLocaleString()}`}
        >
          <p>
            {(dataset.data?.length ?? 0)} rows ·
            {(dataset.fields?.length ?? 0)} fields
          </p>
          <div className="button-row">
            <NavLink to={`/dataset/${dataset.id}`}>
              <Button variant="ghost">View details</Button>
            </NavLink>
            <Button variant="ghost" onClick={() => onDeleteDataset(dataset.id)}>
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default SavedDatasets;

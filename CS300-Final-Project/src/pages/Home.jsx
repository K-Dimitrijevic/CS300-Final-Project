import { NavLink } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

const Home = () => (
  <div className="page">
    <PageHeader
      title="Visualize your data with confidence"
      subtitle="Paste, upload, analyze, and share insights with polished charts."
    >
      <div className="button-row">
        <NavLink to="/input">
          <Button>Start with data</Button>
        </NavLink>
        <NavLink to="/dashboard">
          <Button variant="ghost">View dashboard</Button>
        </NavLink>
      </div>
    </PageHeader>

    <div className="grid">
      <Card title="Flexible inputs" subtitle="Paste JSON or upload CSV/JSON files.">
        <p>
          Validate and normalize your data instantly. We handle structured datasets
          and convert numeric values for charting.
        </p>
      </Card>
      <Card title="Insightful analytics" subtitle="Stats, filters, and sorting.">
        <p>
          Compare minimums, maximums, averages, and totals while curating the
          rows you want to focus on.
        </p>
      </Card>
      <Card title="Multiple chart types" subtitle="Bar, line, pie, and area.">
        <p>
          Switch between chart formats to spot trends fast. Every chart is fully
          responsive on mobile and desktop.
        </p>
      </Card>
    </div>
  </div>
);

export default Home;

import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

const About = () => (
  <div className="page">
    <PageHeader
      title="About VizLab"
      subtitle="A clean, modern data visualization studio built with React + Vite."
    />
    <Card title="Why this project?">
      <p>
        VizLab helps you explore datasets quickly. Upload your own files or use
        the public API feed to discover insights with just a few clicks.
      </p>
      <p>
        The experience is designed to be responsive, accessible, and easy to
        extend with new charts or analytics in the future.
      </p>
    </Card>
  </div>
);

export default About;

import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import useLocalStorage from "./hooks/useLocalStorage";
import AppRoutes from "./routes/AppRoutes";
import "./styles/global.css";

const App = () => {
  const [datasets, setDatasets] = useLocalStorage("vizlab-datasets", []);
  const safeDatasets = Array.isArray(datasets) ? datasets : [];

  const handleSaveDataset = (dataset) => {
    setDatasets((prev) => {
      const existing = prev.find((item) => item.id === dataset.id);
      if (existing) {
        return prev.map((item) => (item.id === dataset.id ? dataset : item));
      }
      return [dataset, ...prev];
    });
  };

  const handleDeleteDataset = (id) => {
    setDatasets((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <main className="content">
          <AppRoutes
            datasets={safeDatasets}
            onSaveDataset={handleSaveDataset}
            onDeleteDataset={handleDeleteDataset}
          />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;

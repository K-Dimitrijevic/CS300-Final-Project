import { Routes, Route } from "react-router-dom";
import About from "../pages/About";
import Dashboard from "../pages/Dashboard";
import DataInput from "../pages/DataInput";
import DatasetDetails from "../pages/DatasetDetails";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import SavedDatasets from "../pages/SavedDatasets";

const AppRoutes = ({ datasets, onSaveDataset, onDeleteDataset }) => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route
      path="/input"
      element={<DataInput onSaveDataset={onSaveDataset} />}
    />
    <Route
      path="/dashboard"
      element={<Dashboard datasets={datasets} onSaveDataset={onSaveDataset} />}
    />
    <Route
      path="/saved"
      element={(
        <SavedDatasets datasets={datasets} onDeleteDataset={onDeleteDataset} />
      )}
    />
    <Route
      path="/dataset/:id"
      element={<DatasetDetails datasets={datasets} />}
    />
    <Route path="/about" element={<About />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;

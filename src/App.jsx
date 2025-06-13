import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CapturePage from './pages/CapturePage';
import DevicePage from './pages/DevicePage';
import SceneBoardPage from './pages/SceneBoardPage';
import ExportPage from './pages/ExportPage';
import ExportImagesPage from './pages/ExportImagesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CapturePage />} />
        <Route path="/device" element={<DevicePage />} />
        <Route path="/scene" element={<SceneBoardPage />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="/export-images" element={<ExportImagesPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { EditorProvider } from '@/lib/editorStore';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import CustomizerPanel from '@/components/CustomizerPanel';
import { EditToggle } from '@/components/EditZone';

function App() {
  return (
    <EditorProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <CustomizerPanel />
        <EditToggle />
      </Router>
    </EditorProvider>
  );
}

export default App;

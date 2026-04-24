import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { InlineEditorProvider } from '@/lib/inlineEditor';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import CustomizerPanel from '@/components/CustomizerPanel';
import EditModeToggle from '@/components/EditModeToggle';

function App() {
  return (
    <InlineEditorProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <CustomizerPanel />
        <EditModeToggle />
      </Router>
    </InlineEditorProvider>
  );
}

export default App;

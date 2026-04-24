import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';

const ROUTE_PATHS = { HOME: '/' };

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path={ROUTE_PATHS.HOME} element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;

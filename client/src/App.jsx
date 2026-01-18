import { Routes, Route } from 'react-router-dom';
import CommunityCamps from './pages/CommunityCamps';
import SchoolDistricts from './pages/SchoolDistricts';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CommunityCamps />} />
      <Route path="/school-districts" element={<SchoolDistricts />} />
    </Routes>
  );
}

export default App;

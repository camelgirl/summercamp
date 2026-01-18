import { Routes, Route } from 'react-router-dom';
import CommunityCamps from './pages/CommunityCamps';
import SchoolDistricts from './pages/SchoolDistricts';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CommunityCamps />} />
      <Route path="/school-districts" element={<SchoolDistricts />} />
    </Routes>
  );
}

export default App;

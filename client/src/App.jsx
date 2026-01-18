import { Routes, Route } from 'react-router-dom';
import CommunityCamps from './pages/CommunityCamps';
import SchoolDistricts from './pages/SchoolDistricts';
import Favorites from './pages/Favorites';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CommunityCamps />} />
      <Route path="/school-districts" element={<SchoolDistricts />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import CommunityCamps from './pages/CommunityCamps';
import SchoolDistricts from './pages/SchoolDistricts';
import Favorites from './pages/Favorites';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CommunityCamps />} />
      <Route path="/school-districts" element={<SchoolDistricts />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;



import { BrowserRouter as Router, Routes, Route ,  Navigate } from 'react-router-dom';
import Login from "./components/Auth/Login";
import Signup from './components/Auth/SignUp';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import BreedPages from './pages/BreedPages';
import Products from './pages/Products';
import Settings from './pages/Settings';


function App() {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />   
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex flex-grow">
                  <Sidebar/>
                <main className="flex-grow p-4">
                  <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/breed-pages" element={<BreedPages />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

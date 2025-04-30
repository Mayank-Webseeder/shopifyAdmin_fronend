import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Auth/Login";
import Signup from './components/Auth/SignUp';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Pages from './pages/Pages';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Settings from './pages/Settings';
import Home from './pages/Home';
import NotFound from './pages/NotFound'; // Import the 404 page
import OfferSections from './pages/OfferSections';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}

        {/* Private Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex">
                {/* Sidebar */}
                <div className="fixed top-0 left-0 bottom-0 w-64 z-10">
                  <Sidebar />
                </div>

                {/* Main Content */}
                <div className="flex flex-col ml-64 w-full">
                  <main className="flex-grow p-4">
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/offers" element={<OfferSections />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/manage-pages" element={<Pages />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} /> {/* 404 Page */}
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 for Unauthenticated Users */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

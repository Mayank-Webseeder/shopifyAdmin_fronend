

// import { BrowserRouter as Router, Routes, Route ,  Navigate } from 'react-router-dom';
// import Login from "./components/Auth/Login";
// import Signup from './components/Auth/SignUp';
// import Sidebar from './components/Sidebar';
// import Navbar from './components/Navbar';
// import Dashboard from './pages/Dashboard';
// import Categories from './pages/Categories';
// import BreedPages from './pages/BreedPages';
// import Products from './pages/Products';
// import Settings from './pages/Settings';
// import Home from './pages/Home';


// function App() {
//   return (
//     <div>
//       <Router>
//         <Routes>
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login />} />   
//           <Route
//             path="/*"
//             element={
//               <div className="min-h-screen flex flex-col">
//                 <Navbar />
//                 <div className="flex flex-grow">
//                   <Sidebar/>
//                 <main className="flex-grow p-4">
//                   <Routes>
//                   <Route path="/home" element={<Home/>} />
//                   <Route path="/dashboard" element={<Dashboard />} />
//                   <Route path="/categories" element={<Categories />} />
//                   <Route path="/breed-pages" element={<BreedPages />} />
//                   <Route path="/products" element={<Products />} />
//                   <Route path="/settings" element={<Settings />} />
//                   </Routes>
//                 </main>
//                 </div>
//               </div>
//             }
//           />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Auth/Login";
import Signup from './components/Auth/SignUp';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import BreedPages from './pages/BreedPages';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Home from './pages/Home';

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
              <div className="min-h-screen flex">
                {/* Fixed sidebar on the left */}
                <div className="fixed top-0 left-0 bottom-0 w-64 z-10">
                  <Sidebar />
                </div>
                
                {/* Main content area with navbar and routes */}
                <div className="flex flex-col ml-64 w-full">
                  {/* Navbar at the top */}
                  <div className="sticky top-0 z-10">
                    <Navbar />
                  </div>
                  
                  {/* Main content */}
                  <main className="flex-grow p-4">
                    <Routes>
                      <Route path="/home" element={<Home />} />
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
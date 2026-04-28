import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import BusinessListing from './pages/BusinessListing';
import BusinessDetail from './pages/BusinessDetail';
import CreateBusiness from './pages/CreateBusiness';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/businesses" element={<BusinessListing />} />
            <Route path="/businesses/:id" element={<BusinessDetail />} />
            <Route path="/create-business" element={<CreateBusiness />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

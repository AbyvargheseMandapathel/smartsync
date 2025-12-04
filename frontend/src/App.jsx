import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import UserDashboard from './pages/Dashboard/UserDashboard';
import UserStats from './pages/Dashboard/UserStats';
import UserOrders from './pages/Dashboard/UserOrders';
import DeliveryAddress from './pages/Dashboard/DeliveryAddress';
import RestaurantDetails from './pages/Dashboard/RestaurantDetails';
import RestaurantDashboard from './pages/Dashboard/RestaurantDashboard';
import MenuManagement from './pages/Restaurant/MenuManagement';
import RestaurantManagement from './pages/Restaurant/RestaurantManagement';
import RestaurantOrders from './pages/Restaurant/RestaurantOrders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/stats" element={<UserStats />} />
        <Route path="/user/orders" element={<UserOrders />} />
        <Route path="/user/checkout" element={<DeliveryAddress />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/menu" element={<MenuManagement />} />
        <Route path="/restaurant/profile" element={<RestaurantManagement />} />
        <Route path="/restaurant/orders" element={<RestaurantOrders />} />
      </Routes>
    </Router>
  );
}

export default App;

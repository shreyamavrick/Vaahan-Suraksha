import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import AllServices from "./pages/AllServices";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Profile from "./components/Dashboard/Profile";
import Orders from "./components/Dashboard/Orders";
import Cars from "./components/Dashboard/Cars";
import Addresses from "./components/Dashboard/Addresses";
import Coins from "./components/Dashboard/Coins";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/allservices" element={<AllServices />} />

        
        <Route path="/dashboard" element={<DashboardLayout />} >
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/orders" element={<Orders />} />
          <Route path="/dashboard/cars" element={<Cars />} />
          <Route path="/dashboard/addresses" element={<Addresses />} />
          <Route path="/dashboard/coins" element={<Coins />} />

          </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

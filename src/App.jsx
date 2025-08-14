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
import Profile from "./pages/Profile";

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
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

import { Routes, Route } from "react-router";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHotels from "./pages/AdminHotels";
import AdminRooms from "./pages/AdminRooms";
import AdminBookings from "./pages/AdminBookings";
import AdminUsers from "./pages/AdminUsers";
import AdminReviews from "./pages/AdminReviews";

import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Customer */}
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route
          path="/hotels/:hotelId"
          element={<HotelDetails />}
        />
        <Route
          path="/book/:hotelId"
          element={<Booking />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/bookings"
          element={<Bookings />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Admin */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/hotels"
          element={<AdminHotels />}
        />
        <Route
          path="/admin/rooms"
          element={<AdminRooms />}
        />
        <Route
          path="/admin/bookings"
          element={<AdminBookings />}
        />
        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />
        <Route
          path="/admin/reviews"
          element={<AdminReviews />}
        />

        {/* Not Found */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
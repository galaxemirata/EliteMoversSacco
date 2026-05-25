import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Book from "./components/Book";
import NairobiMombasa from "./components/NairobiMombasa";
import NairobiIsiolo from "./components/NairobiIsiolo";
import NairobiKaratina from "./components/NairobiKaratina";
import NairobiNanyuki from "./components/NairobiNanyuki";

import MombasaIsiolo from "./components/MombasaIsiolo";
import MombasaKaratina from "./components/MombasaKaratina";
import MombasaNairobi from "./components/MombasaNairobi";
import MombasaNanyuki from "./components/MombasaNanyuki";

import IsioloKaratina from "./components/IsioloKaratina";
import IsioloMombasa from "./components/IsioloMombasa";
import IsioloNairobi from "./components/IsioloNairobi";
import IsioloNanyuki from "./components/IsioloNanyuki";

import KaratinaIsiolo from "./components/KaratinaIsiolo";
import KaratinaMombasa from "./components/KaratinaMombasa";
import KaratinaNairobi from "./components/KaratinaNairobi";
import KaratinaNanyuki from "./components/KaratinaNanyuki";

import NanyukiKaratina from "./components/NanyukiKaratina";
import NanyukiIsiolo from "./components/NanyukiIsiolo";
import NanyukiMombasa from "./components/NanyukiMombasa";
import NanyukiNairobi from "./components/NanyukiNairobi";

import LamuNairobi from "./components/LamuNairobi";
import NairobiLamu from "./components/NairobiLamu";

import Mpesa from "./components/Mpesa";
import AdminDashboard from "./components/AdminDashboard";
import ChatBot from "./components/ChatBot";
import About from "./components/About";
import AdminSignIn from "./components/AdminSignIn";

function App() {
  const [admin, setAdmin] = useState(() => {
    return JSON.parse(localStorage.getItem("admin")) || null;
  });

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    setUser(null);
    window.location.href = "/signin";
  };

  return (
    <div className="App">
      <Router>
        {/* NAVBAR */}
        <nav className="navbar-custom">
          {/* LEFT */}
          <div className="nav-left">
            <Link to="/" className="logo-link">
              <img
                src="images/1000022166.png"
                alt="Elite Movers"
                width={80}
              />
            </Link>

          <ChatBot user={user} />
          </div>

          {/* CENTER */}
          <div className="nav-center">
            <h1 id="h1main">ELITE MOVERS SACCO</h1>
          </div>

          {/* RIGHT */}
          <div className="nav-right">
            <Link to="/" className="btn btn-info text-white">
              Book Now
            </Link>

            {!user ? (
              <Link to="/signin" className="navlink text-info">
                Log In
              </Link>
            ) : (
              <button
                onClick={logout}
                className="btn btn-danger btn-sm"
                style={{ borderRadius: 20 }}
              >
                Logout
              </button>
            )}

            <Link to="/about" className="navlink text-info">
              About
            </Link>

            <Link to="/admin" className="admin-link">
              Admin
            </Link>
          </div>
        </nav>

        <br />
        <br />
        <br />

        <Routes>
          <Route path="/" element={<Book />} />

          {/* FIX: pass setUser */}
          <Route path="/signin" element={<SignIn setUser={setUser} />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/mpesa" element={<Mpesa />} />

          <Route path="/nairobi-karatina" element={<NairobiKaratina />} />
          <Route path="/nairobi-isiolo" element={<NairobiIsiolo />} />
          <Route path="/nairobi-mombasa" element={<NairobiMombasa />} />
          <Route path="/nairobi-nanyuki" element={<NairobiNanyuki />} />
          <Route path="/nairobi-lamu" element={<NairobiLamu />} />

          <Route path="/mombasa-nairobi" element={<MombasaNairobi />} />
          <Route path="/mombasa-nanyuki" element={<MombasaNanyuki />} />
          <Route path="/mombasa-isiolo" element={<MombasaIsiolo />} />
          <Route path="/mombasa-karatina" element={<MombasaKaratina />} />

          <Route path="/isiolo-karatina" element={<IsioloKaratina />} />
          <Route path="/isiolo-mombasa" element={<IsioloMombasa />} />
          <Route path="/isiolo-nairobi" element={<IsioloNairobi />} />
          <Route path="/isiolo-nanyuki" element={<IsioloNanyuki />} />

          <Route path="/karatina-nanyuki" element={<KaratinaNanyuki />} />
          <Route path="/karatina-nairobi" element={<KaratinaNairobi />} />
          <Route path="/karatina-mombasa" element={<KaratinaMombasa />} />
          <Route path="/karatina-isiolo" element={<KaratinaIsiolo />} />

          <Route path="/nanyuki-isiolo" element={<NanyukiIsiolo />} />
          <Route path="/nanyuki-karatina" element={<NanyukiKaratina />} />
          <Route path="/nanyuki-nairobi" element={<NanyukiNairobi />} />
          <Route path="/nanyuki-mombasa" element={<NanyukiMombasa />} />

          <Route path="/lamu-nairobi" element={<LamuNairobi />} />

          <Route
            path="/adminsignin"
            element={<AdminSignIn setAdmin={setAdmin} />}
          />

          <Route
            path="/admin"
            element={
              admin ? (
                <AdminDashboard />
              ) : (
                <AdminSignIn setAdmin={setAdmin} />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Book from './components/Book';
import NairobiMombasa from './components/NairobiMombasa';
import NairobiIsiolo from './components/NairobiIsiolo';
import NairobiKaratina from './components/NairobiKaratina';
import NairobiNanyuki from './components/NairobiNanyuki';

import MombasaIsiolo from './components/MombasaIsiolo';
import MombasaKaratina from './components/MombasaKaratina';
import MombasaNairobi from './components/MombasaNairobi';
import MombasaNanyuki from './components/MombasaNanyuki';
import IsioloKaratina from './components/IsioloKaratina';
import IsioloMombasa from './components/IsioloMombasa';
import IsioloNairobi from './components/IsioloNairobi';
import IsioloNanyuki from './components/IsioloNanyuki';
import KaratinaIsiolo from './components/KaratinaIsiolo';
import KaratinaMombasa from './components/KaratinaMombasa';
import KaratinaNairobi from './components/KaratinaNairobi';
import KaratinaNanyuki from './components/KaratinaNanyuki';
import NanyukiKaratina from './components/NanyukiKaratina';
import NanyukiIsiolo from './components/NanyukiIsiolo';
import NanyukiMombasa from './components/NanyukiMombasa';
import NanyukiNairobi from './components/NanyukiNairobi';
import LamuNairobi from './components/LamuNairobi';
import NairobiLamu from './components/NairobiLamu';

import Mpesa from './components/Mpesa';
import AdminDashboard from './components/AdminDashboard';
import ChatBot from './components/ChatBot';
import About from './components/About';
import AdminSignIn from './components/AdminSignIn';
import Vehicles from './components/Vehicles';
import SeatLayout from './components/SeatLayout';


function App() {

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");

    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  return (
    <div className="App">

      <Router>

        <nav className="navbar-custom">

  {/* LEFT SIDE */}
  <div className="nav-left">
    <Link to="/" className="logo-link">
      <img
        src="images/matatu-removedbg.png"
        alt="Elite Movers"
        width={80}
      />
    </Link>

    <ChatBot />
  </div>

  {/* CENTER */}
  <div className="nav-center">
    <h1 id="h1main">ELITE MOVERS SACCO</h1>
  </div>

  {/* RIGHT SIDE */}
  <div className="nav-right">
    <Link
      to="/"
      className="btn btn-info text-white"
    >
      Book Now
    </Link>

    <Link to="/signin" className="navlink text-info">
      Log In
    </Link>

    <Link to="/about" className="navlink text-info">
      About
    </Link>
  </div>

</nav>

        <br />
        <br />
        <br />

        
 

        <Routes>

          <Route path='/signin' element={<SignIn />} />
          <Route path='/' element={<Book />} />
          <Route path='/about' element={<About />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/mpesa' element={<Mpesa />} />

          <Route path='/nairobi-karatina' element={<NairobiKaratina />} />
          <Route path='/nairobi-isiolo' element={<NairobiIsiolo />} />
          <Route path='/nairobi-mombasa' element={<NairobiMombasa />} />
          <Route path='/nairobi-nanyuki' element={<NairobiNanyuki />} />
          

          <Route path='/mombasa-nairobi' element={<MombasaNairobi />} />
          <Route path='/mombasa-nanyuki' element={<MombasaNanyuki />} />
          <Route path='/mombasa-isiolo' element={<MombasaIsiolo />} />
          <Route path='/mombasa-karatina' element={<MombasaKaratina />} />

          <Route path='/isiolo-karatina' element={<IsioloKaratina />} />
          <Route path='/isiolo-mombasa' element={<IsioloMombasa />} />
          <Route path='/isiolo-nairobi' element={<IsioloNairobi />} />
          <Route path='/isiolo-nanyuki' element={<IsioloNanyuki />} />

          <Route path='/karatina-nanyuki' element={<KaratinaNanyuki />} />
          <Route path='/karatina-nairobi' element={<KaratinaNairobi />} />
          <Route path='/karatina-mombasa' element={<KaratinaMombasa />} />
          <Route path='/karatina-isiolo' element={<KaratinaIsiolo />} />

          <Route path='/nanyuki-isiolo' element={<NanyukiIsiolo />} />
          <Route path='/nanyuki-karatina' element={<NanyukiKaratina />} />
          <Route path='/nanyuki-nairobi' element={<NanyukiNairobi />} />
          <Route path='/nanyuki-mombasa' element={<NanyukiMombasa />} />

          <Route path='/nairobi-lamu' element={<NairobiLamu/>}/>
          <Route path='/lamu-nairobi' element={<LamuNairobi/>}/>

          <Route
            path="/adminsignin"
            element={<AdminSignIn setAdmin={setAdmin} />}
          />

          <Route
            path="/admin"
            element={
              admin ? <AdminDashboard /> : <AdminSignIn setAdmin={setAdmin} />
            }
          />

        </Routes>

      </Router>

    </div>
  );
}

export default App;
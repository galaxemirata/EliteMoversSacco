
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

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
import Mpesa from './components/Mpesa';
import { BiFontFamily } from 'react-icons/bi';
import { PiShowerFill } from 'react-icons/pi';


function App() {
  return (
    <div className="App">
      
        
      

      <Router>

        <nav className='navbar'>
          

        <Link to="/" className='text-info img'><img src="images/matatu-removedbg.png" alt="" width={100}/></Link> 
        
        <div className='justify-content-center h1main'>

          <h1 style={{letterSpacing:10}} id='h1main'>ELITE MOVERS SACCO</h1>

        </div>

        <div className='justify-content-start'>
        <Link to="/" className='text-white   btn btn-info  btn-outline-primary'>Book Now</Link>
        <Link to="/signin" className='text-info navlink'>Sign In</Link>
        <Link to="/signup" className='text-info navlink'>Sign Up</Link>
        </div>

        </nav>
        <br />
        <br />
        
        
        
        <Routes>

          
          <Route path='/signin' element={<SignIn/>}/>
          <Route path='/' element={<Book/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/mpesa' element={<Mpesa/>}/>
          <Route path='/nairobi-karatina' element={<NairobiKaratina/>}/>
          <Route path='/nairobi-isiolo' element={<NairobiIsiolo/>}/>
          <Route path='/nairobi-mombasa' element={<NairobiMombasa/>}/>
          <Route path='/nairobi-nanyuki' element={<NairobiNanyuki/>}/>
          <Route path='/mombasa-nairobi' element={<MombasaNairobi/>}/>
          <Route path='/mombasa-nanyuki' element={<MombasaNanyuki/>}/>
          <Route path='/mombasa-isiolo' element={<MombasaIsiolo/>}/>
          <Route path='/mombasa-karatina' element={<MombasaKaratina/>}/>
          <Route path='/isiolo-karatina' element={<IsioloKaratina/>}/>
          <Route path='/isiolo-mombasa' element={<IsioloMombasa/>}/>
          <Route path='/isiolo-nairobi' element={<IsioloNairobi/>}/>
          <Route path='/isiolo-nanyuki' element={<IsioloNanyuki/>}/>
          <Route path='/karatina-nanyuki' element={<KaratinaNanyuki/>}/>
          <Route path='/karatina-nairobi' element={<KaratinaNairobi/>}/>
          <Route path='/karatina-mombasa' element={<KaratinaMombasa/>}/>
          <Route path='/karatina-isiolo' element={<KaratinaIsiolo/>}/>
          <Route path='/nanyuki-isiolo' element={<NanyukiIsiolo/>}/>
          <Route path='/nanyuki-karatina' element={<NanyukiKaratina/>}/>
          <Route path='/nanyuki-nairobi' element={<NanyukiNairobi/>}/>
          <Route path='/nanyuki-mombasa' element={<NanyukiMombasa/>}/>
          


        </Routes>








      </Router>

      

    </div>
  );
}

export default App;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Book = () => {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const route = `${from}-${to}`;


    if (route === "Nairobi-Karatina") {navigate("/nairobi-karatina")}
      
    

    else if(route === "Nairobi-Mombasa"){navigate("/nairobi-mombasa")}
      
    

    else if(route === "Nairobi-Isiolo"){navigate("/nairobi-isiolo")}
      
    

    else if(route === "Nairobi-Nanyuki"){navigate("/nairobi-nanyuki")}
      
    

    else if(route === "Mombasa-Nairobi"){ navigate("/mombasa-nairobi")}
     
    
    
    else if(route === "Mombasa-Nanyuki"){navigate("/mombasa-nanyuki")}
      
    

    else if(route === "Mombasa-Isiolo"){navigate("/mombasa-isiolo")}
      
    

    else if(route === "Mombasa-Karatina"){navigate("/mombasa-karatina")}      
    

    else if(route === "Isiolo-Karatina"){navigate("/isiolo-karatina")}
      
    

     else if(route === "Isiolo-Mombasa"){navigate("/isiolo-mombasa")}
    
      

     else if(route === "Isiolo-Nairobi"){navigate("/isiolo-nairobi")}
      
    

     else if(route === "Isiolo-Nanyuki"){navigate("/isiolo-nanyuki")}
      
    

    else if(route === "Karatina-Nanyuki"){navigate("/karatina-nanyuki")}
      
    

     else if(route === "Karatina-Nairobi"){navigate("/karatina-nairobi")}
      
    

     else if(route === "Karatina-Nanyuki"){navigate("/karatina-nanyuki")}
      
    

     else if(route === "Karatina-Mombasa"){navigate("/karatina-mombasa")}
      
    

     else if(route === "Karatina-Isiolo"){navigate("/karatina-isiolo")}
      
    

    else if(route === "Nanyuki-Isiolo"){navigate("/nanyuki-isiolo")}
      
    

    else if(route === "Nanyuki-Karatina"){navigate("/nanyuki-karatina")}
      
    

    else if(route === "Nanyuki-Nairobi"){navigate("/nanyuki-nairobi")}
      
    

    else if(route === "Nanyuki-Mombasa"){navigate("/nanyuki-mombasa")}
      
    



    
    else {
      alert("Kindly select a valid Route");
    }
  };

  return (
    <div style={{ padding: "20px" }} className="row justify-content-center">
      <div className="col-md-6 card shadow" style={{borderRadius:30}} id="bookcard">
        
      <p><b className="text-white">WELCOME, KINDLY SELECT YOUR DESTINATION</b></p>
      <br />
      
      

      <form onSubmit={handleSubmit}>
        {/* start of FROM */}
        <div>
          
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="">from:</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Isiolo">Isiolo</option>
            <option value="Karatina">Karatina</option>
            <option value="Nanyuki">Nanyuki</option>
          </select>
        </div>

        <br />

        {/* start of TO */}
        <div>
          
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="">to:</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Isiolo">Isiolo</option>
            <option value="Karatina">Karatina</option>
            <option value="Nanyuki">Nanyuki</option>
          </select>
        </div>

        <br />

        <button type="submit" className="btn bg-info text-white">See Vehicle</button>
        
      </form>
      
    </div>
    
    </div>
  );
};

export default Book;
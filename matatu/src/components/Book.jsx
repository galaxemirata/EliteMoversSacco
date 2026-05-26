import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Book = () => {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // FIX: load username immediately on first render
  const [username] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.username || "";
  });

  useEffect(() => {
    // adsense
    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {}
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const route = `${from}-${to}`;

    if (route === "Nairobi-Karatina") {
      navigate("/nairobi-karatina");
    } else if (route === "Nairobi-Mombasa") {
      navigate("/nairobi-mombasa");
    } else if (route === "Nairobi-Isiolo") {
      navigate("/nairobi-isiolo");
    } else if (route === "Nairobi-Nanyuki") {
      navigate("/nairobi-nanyuki");
    } else if (route === "Mombasa-Nairobi") {
      navigate("/mombasa-nairobi");
    } else if (route === "Mombasa-Nanyuki") {
      navigate("/mombasa-nanyuki");
    } else if (route === "Mombasa-Isiolo") {
      navigate("/mombasa-isiolo");
    } else if (route === "Mombasa-Karatina") {
      navigate("/mombasa-karatina");
    } else if (route === "Isiolo-Karatina") {
      navigate("/isiolo-karatina");
    } else if (route === "Isiolo-Mombasa") {
      navigate("/isiolo-mombasa");
    } else if (route === "Isiolo-Nairobi") {
      navigate("/isiolo-nairobi");
    } else if (route === "Isiolo-Nanyuki") {
      navigate("/isiolo-nanyuki");
    } else if (route === "Karatina-Nanyuki") {
      navigate("/karatina-nanyuki");
    } else if (route === "Karatina-Nairobi") {
      navigate("/karatina-nairobi");
    } else if (route === "Karatina-Mombasa") {
      navigate("/karatina-mombasa");
    } else if (route === "Karatina-Isiolo") {
      navigate("/karatina-isiolo");
    } else if (route === "Nanyuki-Isiolo") {
      navigate("/nanyuki-isiolo");
    } else if (route === "Nanyuki-Karatina") {
      navigate("/nanyuki-karatina");
    } else if (route === "Nanyuki-Nairobi") {
      navigate("/nanyuki-nairobi");
    } else if (route === "Nanyuki-Mombasa") {
      navigate("/nanyuki-mombasa");
    } else if (route === "Nairobi-Lamu") {
      navigate("/nairobi-lamu");
    } else if (route === "Lamu-Nairobi") {
      navigate("/lamu-nairobi");
    } else {
      alert("Kindly select a valid Route");
    }
  };

  return (
    <div style={{ padding: "20px" }} className="row justify-content-center">
      <div
        className="col-md-6 card shadow"
        style={{ borderRadius: 30 }}
        id="bookcard"
      >
        {/* TOP BANNER */}
        <div
          className="mb-3 p-3 text-center"
          style={{
            background: "#0dcaf0",
            borderRadius: "15px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Book With us, Travel With Comfort and save 5%
        </div>

        <p>
          <b
            className="text-white"
            style={{ textTransform: "uppercase" }}
          >
            WELCOME {username ? `${username}, ` : ""} KINDLY SELECT YOUR
            DESTINATION
          </b>
        </p>

        <br />

        <form onSubmit={handleSubmit}>
          <div>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">from:</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Isiolo">Isiolo</option>
              <option value="Karatina">Karatina</option>
              <option value="Nanyuki">Nanyuki</option>
              <option value="Lamu">Lamu</option>
            </select>
          </div>

          <br />

          <div>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="">to:</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Isiolo">Isiolo</option>
              <option value="Karatina">Karatina</option>
              <option value="Nanyuki">Nanyuki</option>
              <option value="Lamu">Lamu</option>
            </select>
          </div>

          <br />

          <button type="submit" className="btn bg-info text-white">
            See Vehicle
          </button>
        </form>

        {/* ADSENSE */}
        <div className="my-4 text-center">
          <ins
            className="adsbygoogle"
            style={{ display: "block", minHeight: "100px" }}
            data-ad-client="ca-pub-xxxxxxxxxxxx"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>

        {/* BOTTOM BANNER */}
        <div
          className="mt-4 p-3 text-center"
          style={{
            background: "#222",
            borderRadius: "15px",
            color: "white",
          }}
        >
          ⭐{" "}
          <b>
            Want to hire our vehicles? Get contact details in the About section
          </b>
        </div>
      </div>
    </div>
  );
};

export default Book;
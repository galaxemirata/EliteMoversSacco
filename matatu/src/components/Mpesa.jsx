import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Mpesa = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from;
  const vehicle = location.state?.vehicle;

 const seats = location.state?.seats || []; 
  const seatCount = seats.length;

  const routeKey = `${from}:${vehicle}`;
  const routeName = from?.replace("/", "");

  const [phone, setPhone] = useState("");
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [pickup, setPickup] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= GET PRICE =================
  useEffect(() => {
    if (!vehicle) return;

    const fetchPrice = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/vehicles");
        const data = await res.json();

        const found = data.find(
          (v) => v.number_plate === vehicle
        );

        if (found?.price) {
          setPricePerSeat(Number(found.price));
        }
      } catch (err) {
        console.log("Price fetch error:", err);
      }
    };

    fetchPrice();
  }, [vehicle]);

  // ================= SEAT SYNC =================
  const syncSeats = () => {
    window.dispatchEvent(new Event("seat-sync"));
  };

  // ================= PAYMENT =================
  const handlePayment = async () => {
    if (!phone || !pickup) {
      alert("Please fill all fields");
      return;
    }

    const phoneRegex = /^254\d{9}$/;

    if (!phoneRegex.test(phone)) {
      alert("Phone must be in format 2547XXXXXXXX");
      return;
    }

    if (seatCount === 0) {
      alert("No seats selected");
      return;
    }

    const amount = seatCount * pricePerSeat;

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/mpesa_payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            seats,
            amount,               
            route: routeName,
            vehicle,
            pickup_location: pickup,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Payment failed");
        return;
      }

      // ================= SAVE PAID SEATS =================
      const existing =
        JSON.parse(localStorage.getItem(`paidSeats:${routeKey}`)) || [];

      const updatedSeats = [...new Set([...existing, ...seats])];

      localStorage.setItem(
        `paidSeats:${routeKey}`,
        JSON.stringify(updatedSeats)
      );

      syncSeats();

      alert("Thankyou..Please check your phone to complete payment");

      navigate(from);
    } catch (err) {
      console.log(err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center ">
      <div className="card col-md-5 shadow p-4" id="mpesacard">

        {/* HEADER */}
        <h4 className="text-center mb-3 text-white"> M-Pesa Payment</h4> <b className="text-info"> {from} </b>
         
        

        {/* VEHICLE */}
        <input
          value={vehicle || ""}
          readOnly
          className="form-control mb-3"
        />

        {/* SEATS */}
        {seats.length > 0 && (
          <div className="mb-2">
            <small className="text-secondary">Selected Seats</small>
            <p className="text-warning mb-1">
              {seats.join(", ")}
            </p>
          </div>
        )}

        {/* PHONE */}
        <input
          type="text"
          placeholder="2547XXXXXXXX"
          className="form-control mb-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* PRICE */}
        <div className="alert alert-light py-2">
          <strong>Total:</strong>{" "}
          {seatCount} × {pricePerSeat} ={" "}
          <span className="text-success fw-bold">
            {seatCount * pricePerSeat} 
          </span>
        </div>

        {/* PICKUP */}
        <textarea
          placeholder="Enter pickup location"
          className="form-control mb-3"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />

        {/* PAY BUTTON */}
        <button
          className="btn btn-info w-100"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay with M-Pesa"}
        </button>

        {/* BACK BUTTON */} 
        <button
          className="btn btn-secondary w-100 mt-2"
          onClick={() => navigate(from)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Mpesa;
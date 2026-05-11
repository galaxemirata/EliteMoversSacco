import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Mpesa = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const seat = location.state?.seat;
  const from = location.state?.from;
  const vehicle = location.state?.vehicle;

  const routeName = from?.replace("/", "");

  const routeKey = `${from}:${vehicle}`;

  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [pickup, setPickup] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // GET PRICE FROM BACKEND VEHICLE DATA
  // =========================
  useEffect(() => {

    if (!vehicle) return;

    fetch("http://localhost:5000/api/vehicles")
      .then(res => res.json())
      .then(data => {

        const found = data.find(
          v => v.number_plate === vehicle
        );

        if (found?.price) {
          setAmount(found.price);
        } else {
          setAmount("");
        }

      })
      .catch(err => console.log(err));

  }, [vehicle]);

  // =========================
  // SEAT SYNC EVENT
  // =========================
  const syncSeats = () => {
    window.dispatchEvent(new Event("seat-sync"));
  };

  // =========================
  // PAYMENT LOGIC
  // =========================
  const handlePayment = async () => {

    if (!phone || !amount) {
    alert("Fill all fields");
    return;
    }

    // Must start with 254 and contain 12 digits total
    const phoneRegex = /^254\d{9}$/;

    if (!phoneRegex.test(phone)) {
    alert("Phone number must start with 254 and be valid");
    return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        "http://localhost:5000/api/mpesa_payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phone,
            amount,
            seat,
            route: routeName,
            vehicle,
            pickup_location: pickup
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Payment failed");
        return;
      }

      // =========================
      // SAVE SEAT
      // =========================
      const existing =
        JSON.parse(localStorage.getItem(`paidSeats:${routeKey}`)) || [];

      if (!existing.includes(seat)) {

        localStorage.setItem(
          `paidSeats:${routeKey}`,
          JSON.stringify([...existing, seat])
        );
      }

      syncSeats();

      alert("Thankyou...kindly check your phone to complete payment");

      navigate(from);

    } catch (err) {

      console.log(err);
      alert("Payment error..check your internet connection");

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="row justify-content-center">

      <div
        className="text-light p-4 card shadow col-md-6"
        style={{ borderRadius: 50 }}
        id="mpesacard"
      >

        <p className="text-white">
          M-Pesa Payment{" "}
          <b className="text-info">
            {from}
          </b>
        </p>

        {/* VEHICLE */}
        <input
          value={vehicle || "KDA 123A"}
          className="text-dark form-control mb-3"
          readOnly
        />

        {/* SEAT */}
        {seat && (
          <p className="text-warning">
            You selected seat {seat}
          </p>
        )}

        {/* PHONE */}
        <input
          type="text"
          placeholder="Enter Phone (2547XXXXXXXX)"
          className="form-control mb-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <p className="text-light">
          Amount is filled automatically
        </p>

        {/* AMOUNT (READ ONLY) */}
        <input
          type="number"
          className="form-control mb-3"
          value={amount}
          readOnly
        />

        {/* PICKUP */}
        <p>Kindly specify where you are standing</p>
        <textarea
          className="form-control mb-3"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />

        {/* PAY */}
        <button
          className="btn btn-info form-control"
          onClick={handlePayment}
          disabled={loading}
          style={{ borderRadius: 50 }}
        >
          {loading ? "Processing..." : "PAY"}
        </button>

        {/* BACK */}
        <button
          className="btn btn-secondary form-control mt-2"
          onClick={() => navigate(from)}
          style={{ borderRadius: 50 }}
        >
          <b>BACK</b>
        </button>

      </div>

    </div>
  );
};

export default Mpesa;
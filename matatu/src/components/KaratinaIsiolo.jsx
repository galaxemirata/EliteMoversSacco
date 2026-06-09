import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

const KaratinaIsiolo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [vehicles, setVehicles] = useState([]);
  const [vehicleIndex, setVehicleIndex] = useState(0);
  const [paidSeats, setPaidSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // ================= LOAD VEHICLES =================
  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (v) => v.route_name === "karatina-isiolo"
        );
        setVehicles(filtered);
      })
      .catch((err) => console.log(err));
  }, []);

  const vehicle = vehicles[vehicleIndex] || null;

  // ================= SEAT LAYOUT =================
  const seatRows = [
    ["s0", "s1"],
    ["s2", "s3", "s4"],
    ["s7", "aisle", "s6", "s5"],
    ["s8", "aisle", "s9", "s10"],
    ["s13", "aisle", "s12", "s11"],
    ["s14", "s15", "s16"],
  ];

  const totalSeats = seatRows.flat().filter((s) => s !== "aisle").length;

  const remainingSeats = totalSeats - paidSeats.length;

  // ================= LOAD PAID SEATS =================
  const loadSeats = async () => {
    if (!vehicle?.number_plate) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/paid_seats/${vehicle.number_plate}`
      );

      const data = await res.json();
      setPaidSeats(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!vehicle) return;

    loadSeats();

    const interval = setInterval(() => {
      loadSeats();
    }, 5000);

    return () => clearInterval(interval);
  }, [vehicle]);

  // ================= AUTO SWITCH VEHICLE =================
  useEffect(() => {
    if (paidSeats.length >= totalSeats) {
      setVehicleIndex((prev) =>
        prev < vehicles.length - 1 ? prev + 1 : prev
      );
    }
  }, [paidSeats, vehicles.length, totalSeats]);

  // ================= ENTER KEY =================
  useEffect(() => {
    const handleEnterKey = (e) => {
      if (e.key === "Enter") {
        handleDone();
      }
    };

    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  }, [selectedSeats, vehicle]);

  // ================= SEAT SELECT =================
  const handleSeatSelection = (seat) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seat)) {
        return prev.filter((s) => s !== seat);
      }
      return [...prev, seat];
    });
  };

  // ================= DONE =================
  const handleDone = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    if (!vehicle?.number_plate) {
      alert("Please wait as the vehicle gets uploaded..");
      return;
    }

    try {
      const latest = await fetch(
        `http://localhost:5000/api/paid_seats/${vehicle.number_plate}`
      );

      const latestPaidSeats = await latest.json();

      const alreadyBooked = selectedSeats.some((seat) =>
        latestPaidSeats.includes(seat)
      );

      if (alreadyBooked) {
        alert("One or more seats were just booked. Try again.");
        loadSeats();
        return;
      }

      navigate("/mpesa", {
        state: {
          seats: selectedSeats,
          from: location.pathname,
          vehicle: vehicle.number_plate,
        },
      });
    } catch (err) {
      console.log(err);
      alert("Unable to verify seats. Try again.");
    }
  };

  // ================= STYLE =================
  const seatStyle = (seat) => {
    const isPaid = paidSeats.includes(seat);
    const isSelected = selectedSeats.includes(seat);

    return {
      width: "55px",
      height: "55px",
      borderRadius: "14px",
      background: isPaid
        ? "grey"
        : isSelected
        ? "limegreen"
        : "#00bfff",
      cursor: isPaid ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      border: "2px solid white",
      boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
      userSelect: "none",
    };
  };

  return (
    <div className="min-vh-100 py-4">
      <div className="container d-flex flex-column align-items-center">

        <b className="btn bg-info text-dark mb-3">
          Karatina - Isiolo
        </b>

        <b>Vehicle:</b>

        <p className="text-info text-center btn" id="numberplate">
          <b>
            {vehicle
              ? `${vehicle.number_plate} — ${vehicle.driver_name}`
              : "Vehicle being uploaded..."}
          </b>
        </p>

        <p className="text-dark fw-bold">
          <b>{remainingSeats} Seats Remaining</b>
        </p>

        {/* ================= SEATS UI ================= */}
        <div
          className="p-4 mt-3"
          style={{
            background: "#1c1c1c",
            borderRadius: "25px",
            border: "3px solid #00bfff",
            width: "350px",
          }}
        >
          <div className="d-flex justify-content-center align-items-center mb-4">
            <div onClick={() => handleSeatSelection("s0")} style={seatStyle("s0")}>0</div>
            <div onClick={() => handleSeatSelection("s1")} style={seatStyle("s1")}>1</div>
            <div style={{ width: "55px" }} />
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "14px",
                background: "#444",
                color: "blue",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                border: "2px solid white",
              }}
            >
              D
            </div>
          </div>

          {seatRows.slice(1).map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="d-flex align-items-center mb-3"
              style={{
                gap: "10px",
                justifyContent: "center",
                paddingLeft:
                  row.includes("s2") || row.includes("s14") ? "60px" : "0px",
                paddingRight:
                  row.includes("s4") || row.includes("s16") ? "60px" : "0px",
              }}
            >
              {row.map((seat, i) =>
                seat === "aisle" ? (
                  <div key={i} style={{ width: "40px" }} />
                ) : (
                  <div
                    key={seat}
                    onClick={() => {
                      if (paidSeats.includes(seat)) return;
                      handleSeatSelection(seat);
                    }}
                    style={seatStyle(seat)}
                  >
                    {seat.replace("s", "")}
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {/* ================= LEGEND ================= */}
        <div className="d-flex gap-4 mt-4 flex-wrap text-white">
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 20, height: 20, background: "#00bfff" }} />
            Available
          </div>

          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 20, height: 20, background: "limegreen" }} />
            Selected
          </div>

          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 20, height: 20, background: "grey" }} />
            Booked
          </div>
        </div>

        <input
          type="submit"
          value="DONE"
          onClick={handleDone}
          className="btn bg-info text-dark mt-4 px-5"
        />

      </div>
    </div>
  );
};

export default KaratinaIsiolo;
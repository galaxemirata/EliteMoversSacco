import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

const IsioloNanyuki = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [vehicles, setVehicles] = useState([]);
  const [vehicleIndex, setVehicleIndex] = useState(0);
  const [paidSeats, setPaidSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (v) => v.route_name === "isiolo-nanyuki"
        );
        setVehicles(filtered);
      })
      .catch((err) => console.log(err));
  }, []);

  const vehicle = vehicles[vehicleIndex] || null;

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

  const routeKey = vehicle
    ? `${location.pathname}:${vehicle.number_plate}`
    : location.pathname;

  const loadSeats = () => {
    const stored =
      JSON.parse(localStorage.getItem(`paidSeats:${routeKey}`)) || [];
    setPaidSeats(stored);
  };

  useEffect(() => {
    if (!vehicle) return;

    loadSeats();

    const sync = () => loadSeats();
    window.addEventListener("seat-sync", sync);

    return () => window.removeEventListener("seat-sync", sync);
  }, [routeKey, vehicle]);

  useEffect(() => {
    if (paidSeats.length >= totalSeats) {
      setVehicleIndex((prev) =>
        prev < vehicles.length - 1 ? prev + 1 : prev
      );
    }
  }, [paidSeats, vehicles.length, totalSeats]);

  const handleSeatSelection = (seat) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seat)) {
        return prev.filter((s) => s !== seat);
      }
      return [...prev, seat];
    });
  };

  const handleDone = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    if (!vehicle?.number_plate) {
      alert("Please wait as the vehicle gets uploaded..");
      return;
    }

    navigate("/mpesa", {
      state: {
        seats: selectedSeats,
        from: location.pathname,
        vehicle: vehicle.number_plate,
      },
    });
  };

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
          Isiolo-Nanyuki
        </b>

        <b>Vehicle: </b>

        {/* FIX: DRIVER NAME ADDED */}
        <p className="text-info text-center btn" id="numberplate">
          <b>
            {vehicle
              ? `${vehicle.number_plate} - ${vehicle.driver_name}`
              : "Vehicle being uploaded..."}
          </b>
        </p>

        <p className="text-dark fw-bold">
          <b>{remainingSeats} Seats Remaining</b>
        </p>

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
            <div onClick={() => handleSeatSelection("s0")} style={seatStyle("s0")}>
              0
            </div>

            <div onClick={() => handleSeatSelection("s1")} style={seatStyle("s1")}>
              1
            </div>

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
              {row.map((seat, i) => {
                if (seat === "aisle") {
                  return (
                    <div
                      key={`aisle-${rowIndex}-${i}`}
                      style={{ width: "40px" }}
                    />
                  );
                }

                return (
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
                );
              })}
            </div>
          ))}
        </div>

        <div className="d-flex gap-4 mt-4 flex-wrap text-white">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 20,
                height: 20,
                background: "#00bfff",
                borderRadius: 4,
              }}
            />
            Available
          </div>

          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 20,
                height: 20,
                background: "limegreen",
                borderRadius: 4,
              }}
            />
            Selected
          </div>

          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 20,
                height: 20,
                background: "grey",
                borderRadius: 4,
              }}
            />
            Booked
          </div>
        </div>

        <input
          type="submit"
          value={"DONE"}
          onClick={handleDone}
          className="btn bg-info text-dark mt-4 px-5"
        />
      </div>
    </div>
  );
};

export default IsioloNanyuki;
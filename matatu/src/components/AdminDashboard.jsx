import React, { useEffect, useState } from "react";

const AdminDashboard = () => {

  const [payments, setPayments] = useState([]);
  const [route, setRoute] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPayments = async (selectedRoute = "") => {

    try {
      setLoading(true);

      const url = selectedRoute
        ? `http://localhost:5000/api/admin/payments?route=${selectedRoute}`
        : "http://localhost:5000/api/admin/payments";

      const res = await fetch(url);
      const data = await res.json();

      console.log("ADMIN RESPONSE:", data);

      // 🔥 FIX: ensure array always
      if (Array.isArray(data)) {
        setPayments(data);
      } else if (Array.isArray(data.data)) {
        setPayments(data.data);
      } else {
        setPayments([]);
        console.warn("Unexpected response format:", data);
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mt-4">

      <h3>Admin Dashboard - Payments</h3>

      {/* FILTER */}
      <select
        className="form-control mb-3"
        onChange={(e) => {
          setRoute(e.target.value);
          fetchPayments(e.target.value);
        }}
      >
        <option value="">All Vehicles</option>
        <option value="nairobi-karatina">Nairobi - Karatina</option>
        <option value="nairobi-mombasa">Nairobi - Mombasa</option>
        <option value="mombasa-nairobi">Mombasa - Nairobi</option>
        <option value="isiolo-karatina">Isiolo - Karatina</option>
      </select>

      {/* PRINT BUTTON */}
      <button className="btn btn-dark mb-3" onClick={handlePrint}>
        Print Manifest
      </button>

      {/* LOADING STATE */}
      {loading && <p>Loading payments...</p>}

      {/* TABLE */}
      <div id="printArea">

        <table className="table table-bordered table-striped">

          <thead>
            <tr>
              <th>ID</th>
              <th>Phone</th>
              <th>Seat</th>
              <th>Route</th>
              <th>Amount</th>
              <th>Pickup</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.phone}</td>
                  <td>{p.seat}</td>
                  <td>{p.route}</td>
                  <td>{p.amount}</td>
                  <td>{p.pickup_location}</td>
                  <td>{p.status}</td>
                  <td>{p.created_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default AdminDashboard;
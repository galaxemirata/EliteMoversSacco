import React, { useEffect, useState } from 'react'

const AdminDashboard = () => {

  const [bookings, setBookings] = useState([])
  const [vehicles, setVehicles] = useState([])

  const [numberPlate, setNumberPlate] = useState("")
  const [routeName, setRouteName] = useState("")
  const [totalSeats, setTotalSeats] = useState("")
  const [price, setPrice] = useState("") // ONLY ADDITION

  
  // FETCH BOOKINGS

  const fetchBookings = async () => {

    try {
      const res = await fetch("http://localhost:5000/api/admin/bookings")
      const data = await res.json()
      setBookings(data)
    } catch (err) {
      console.log(err)
    }
  }

  // FETCH VEHICLES
 
  const fetchVehicles = async () => {

    try {
      const res = await fetch("http://localhost:5000/api/vehicles")
      const data = await res.json()
      setVehicles(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchBookings()
    fetchVehicles()
  }, [])


  // ADD VEHICLE (LOGIC PRESERVED)
 
  const addVehicle = async () => {

    if (!numberPlate || !routeName || !totalSeats || !price) {
      alert("Fill all fields")
      return
    }

    try {

      const res = await fetch(
        "http://localhost:5000/api/admin/add_vehicle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            number_plate: numberPlate,
            route_name: routeName,
            total_seats: Number(totalSeats),
            price: Number(price)
          })
        }
      )

      const data = await res.json()

      alert(data.message || "Vehicle added successfully")

      setNumberPlate("")
      setRouteName("")
      setTotalSeats("")
      setPrice("")

      fetchVehicles()

    } catch (err) {
      console.log(err)
      alert("Error adding vehicle")
    }
  }


  // DELETE VEHICLE (FIXED ONLY)

  const removeVehicle = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    )

    if (!confirmDelete) return

    try {

      const res = await fetch(
        `http://localhost:5000/api/admin/remove_vehicle/${id}`,
        {
          method: "DELETE"
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Error removing vehicle")
        return
      }

      alert(data.message || "Vehicle removed")

      fetchVehicles()

    } catch (err) {
      console.log(err)
      alert("Error removing vehicle")
    }
  }

  const logout = () => {
    localStorage.removeItem("admin")
    window.location.href = "/adminsignin"
  }

  return (

    <div className='container mt-4'>

      <h1><b>ADMIN</b></h1>

      <div className="mb-4">

        {Object.keys(
          bookings.reduce((acc, b) => {
            if (!acc[b.number_plate]) acc[b.number_plate] = []
            acc[b.number_plate].push(b)
            return acc
          }, {})
        ).map(vehicle => (

          <div key={vehicle} className="card p-3 mb-3">

            <h4 className="text-primary">{vehicle}</h4>

            <table className='table table-sm'>

              <thead>
                <tr>
                  <th>Seat</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Route</th>
                </tr>
              </thead>

              <tbody>

                {bookings
                  .filter(b => b.number_plate === vehicle)
                  .map(b => (

                    <tr key={b.id}>
                      <td>{b.seat_number}</td>
                      <td>{b.phone}</td>
                      <td>KES {b.amount}</td>
                      <td>{b.route_name}</td>
                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        ))}

      </div>


      <div className="card p-4" id='addvehicle'>

        <p className='text-info'>ADD VEHICLE HERE</p>

        <input
          type="text"
          placeholder="Number Plate"
          className="form-control mb-2"
          value={numberPlate}
          onChange={(e) => setNumberPlate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Route Name"
          className="form-control mb-2"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total Seats"
          className="form-control mb-2"
          value={totalSeats}
          onChange={(e) => setTotalSeats(e.target.value)}
        />

        {/* ONLY ADDITION */}
        <input
          type="number"
          placeholder="Price"
          className="form-control mb-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button className="btn btn-info" onClick={addVehicle}>
          Add
        </button>

        <br />

        <button onClick={logout} className='btn btn-danger'>
          Logout
        </button>

      </div>


      <div className="card mt-4 p-3">

        <h4>Active Vehicles</h4>

        {vehicles.map(v => (

          <div key={v.id}>

             {v.number_plate} — {v.route_name} ({v.total_seats} seats)
            {" "} @ {v.price}

            <br />

            <button
              className="btn btn-sm btn-danger mt-2"
              onClick={() => removeVehicle(v.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}

export default AdminDashboard
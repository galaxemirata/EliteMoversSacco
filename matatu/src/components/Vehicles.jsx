import React, { useEffect, useState } from 'react'
import SeatLayout from './SeatLayout'

const Vehicles = () => {
  

  const [vehicles, setVehicles] = useState([])

  useEffect(() => {

    fetchVehicles()

  }, [])

  const fetchVehicles = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/vehicles"
      )

      const data = await response.json()

      setVehicles(data)

    } catch (err) {

      console.log(err)

    }
  }

  return (

    <div className='container mt-4'>

      <h2>Available Vehicles</h2>

      <div className='row'>

        {vehicles.map((vehicle) => (

          <div className='col-md-4 mb-4' key={vehicle.id}>

            <div className='card p-3 shadow'>

              {/* NUMBER PLATE */}
              <h4>{vehicle.number_plate}</h4>

              {/* ROUTE */}
              <p>
                Route: {vehicle.route_name}
              </p>

              {/* SEATS */}
              <SeatLayout vehicleId={vehicle.id} />

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Vehicles
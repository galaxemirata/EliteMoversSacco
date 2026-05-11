import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'

const IsioloKaratina = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const [vehicles, setVehicles] = useState([])
  const [vehicleIndex, setVehicleIndex] = useState(0)
  const [paidSeats, setPaidSeats] = useState([])

  // FETCH ONLY KARATINA VEHICLES
  useEffect(() => {

    fetch("http://localhost:5000/api/vehicles")
      .then(res => res.json())
      .then(data => {

        const filtered = data.filter(
          v => v.route_name === "isiolo-karatina"
        )

        setVehicles(filtered)
      })
      .catch(err => console.log(err))

  }, [])

  const vehicle = vehicles[vehicleIndex] || null

  const seatRows = [
    ['s0', 's1'],
    ['s3', 's4', 's5', 's6'],
    ['s7', 's8', 's9'],
    ['s10', 's11', 's12'],
    ['s13', 's14', 's15', 's16']
  ]

  const totalSeats = seatRows.flat().length

  const routeKey = vehicle
    ? `${location.pathname}:${vehicle.number_plate}`
    : location.pathname

  const loadSeats = () => {

    const stored =
      JSON.parse(localStorage.getItem(`paidSeats:${routeKey}`)) || []

    setPaidSeats(stored)
  }

  useEffect(() => {

    if (!vehicle) return

    loadSeats()

    const sync = () => loadSeats()

    window.addEventListener("seat-sync", sync)

    return () =>
      window.removeEventListener("seat-sync", sync)

  }, [routeKey, vehicle])

  useEffect(() => {

    if (paidSeats.length >= totalSeats) {

      setVehicleIndex(prev =>
        prev < vehicles.length - 1 ? prev + 1 : prev
      )
    }

  }, [paidSeats, vehicles.length, totalSeats])

  const handleSeatClick = (seat) => {

    if (!vehicle) return

    navigate('/mpesa', {
      state: {
        seat,
        from: location.pathname,
        vehicle: vehicle.number_plate
      }
    })
  }

  return (

    <div className='bg-dark row justify-content-center'>

      <b className='btn bg-info text-dark'>
        Isiolo-Karatina
      </b>

      <p className='text-white text-center mt-2'>
        Vehicle: {vehicle?.number_plate || "Loading vehicles..."}
      </p>

      <div className='col-md-6'>

        {seatRows.map((row, i) => (

          <div key={i}>

            {row.map(seat => (

              <input
                key={seat}
                type="checkbox"
                checked={paidSeats.includes(seat)}
                disabled={paidSeats.includes(seat)}
                onChange={() => handleSeatClick(seat)}
              />

            ))}

            <br />

          </div>

        ))}

      </div>

    </div>
  )
}

export default IsioloKaratina
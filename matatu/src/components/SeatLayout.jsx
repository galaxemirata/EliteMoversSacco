import React, { useEffect, useState } from 'react'

const SeatLayout = ({ vehicleId }) => {

  const [bookedSeats, setBookedSeats] = useState([])

  // total seats
  const seats = Array.from(
    { length: 14 },
    (_, i) => i + 1
  )

  useEffect(() => {

    fetchBookedSeats()

  }, [])

  const fetchBookedSeats = async () => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/booked_seats/${vehicleId}`
      )

      const data = await response.json()

      setBookedSeats(data)

    } catch (err) {

      console.log(err)

    }
  }

  return (

    <div className='row'>

      {seats.map((seat) => (

        <div
          className='col-4 mb-2'
          key={seat}
        >

          <label>

            <input
              type="checkbox"

              checked={
                bookedSeats.includes(
                  seat.toString()
                )
              }

              disabled={
                bookedSeats.includes(
                  seat.toString()
                )
              }
            />

            Seat {seat}

          </label>

        </div>

      ))}

    </div>
  )
}

export default SeatLayout

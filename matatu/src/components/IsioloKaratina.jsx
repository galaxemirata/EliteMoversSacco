import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'

const IsioloKaratina = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [paidSeats, setPaidSeats] = useState(() => {
  return JSON.parse(localStorage.getItem("paidSeats")) || []
})

useEffect(() => {
  localStorage.setItem("paidSeats", JSON.stringify(paidSeats))
}, [paidSeats])

  // Receive paid seat from Mpesa page
  

  const handleSeatClick = (seat) => {
    navigate('/mpesa', { state: { seat } })
  }

  return (
    <div className='bg-dark row'>
      <b className='btn bg-dark text-info'>KDX 234J</b>

      <div className='col-md-6'>

        <input type="checkbox" className='s0'
          checked={paidSeats.includes('s0')}
          disabled={paidSeats.includes('s0')}
          onChange={() => handleSeatClick('s0')}
        />
        <input type="checkbox" className='s1'
          checked={paidSeats.includes('s1')}
          disabled={paidSeats.includes('s1')}
          onChange={() => handleSeatClick('s1')}
        />
        <br />

        <input type="checkbox" className='s3'
          checked={paidSeats.includes('s3')}
          disabled={paidSeats.includes('s3')}
          onChange={() => handleSeatClick('s3')}
        />
        <input type="checkbox" className='s4'
          checked={paidSeats.includes('s4')}
          disabled={paidSeats.includes('s4')}
          onChange={() => handleSeatClick('s4')}
        />
        <input type="checkbox" className='s5'
          checked={paidSeats.includes('s5')}
          disabled={paidSeats.includes('s5')}
          onChange={() => handleSeatClick('s5')}
        />
        <input type="checkbox" className='s6'
          checked={paidSeats.includes('s6')}
          disabled={paidSeats.includes('s6')}
          onChange={() => handleSeatClick('s6')}
        />
        <br />

        <input type="checkbox" className='s7'
          checked={paidSeats.includes('s7')}
          disabled={paidSeats.includes('s7')}
          onChange={() => handleSeatClick('s7')}
        />
        <input type="checkbox" className='s8'
          checked={paidSeats.includes('s8')}
          disabled={paidSeats.includes('s8')}
          onChange={() => handleSeatClick('s8')}
        />
        <input type="checkbox" className='s9'
          checked={paidSeats.includes('s9')}
          disabled={paidSeats.includes('s9')}
          onChange={() => handleSeatClick('s9')}
        />
        <br />

        <input type="checkbox" className='s10'
          checked={paidSeats.includes('s10')}
          disabled={paidSeats.includes('s10')}
          onChange={() => handleSeatClick('s10')}
        />
        <input type="checkbox" className='s11'
          checked={paidSeats.includes('s11')}
          disabled={paidSeats.includes('s11')}
          onChange={() => handleSeatClick('s11')}
        />
        <input type="checkbox" className='s12'
          checked={paidSeats.includes('s12')}
          disabled={paidSeats.includes('s12')}
          onChange={() => handleSeatClick('s12')}
        />
        <br />

        <input type="checkbox" className='s13'
          checked={paidSeats.includes('s13')}
          disabled={paidSeats.includes('s13')}
          onChange={() => handleSeatClick('s13')}
        />
        <input type="checkbox" className='s14'
          checked={paidSeats.includes('s14')}
          disabled={paidSeats.includes('s14')}
          onChange={() => handleSeatClick('s14')}
        />
        <input type="checkbox" className='s15'
          checked={paidSeats.includes('s15')}
          disabled={paidSeats.includes('s15')}
          onChange={() => handleSeatClick('s15')}
        />
        <input type="checkbox" className='s16'
          checked={paidSeats.includes('s16')}
          disabled={paidSeats.includes('s16')}
          onChange={() => handleSeatClick('s16')}
        />

      </div>
    </div>
  )
}

export default IsioloKaratina
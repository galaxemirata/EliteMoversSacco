import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Mpesa = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const seat = location.state?.seat

  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')

  const handlePayment = async () => {
    if (!phone || !amount) {
      alert("Fill all fields")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/mpesa_payment", {method: "POST",
        
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, amount, seat })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Payment failed..kindly check your internet connection")
        return
      }

      alert(data.message)

      // Save paid seat directly to localStorage
      const existing = JSON.parse(localStorage.getItem("paidSeats")) || []

      if (seat && !existing.includes(seat)) {
        const updated = [...existing, seat]
        localStorage.setItem("paidSeats", JSON.stringify(updated))
      }

      // Go back to seat page
      navigate('/')

    } catch (error) {
      console.error(error)
      alert("Payment failed...kindly check your internet connection")
    }
  }

  return (
    <div className="bg-dark text-light p-4">
      <h3 className="text-info">M-Pesa Payment</h3>

      {seat && (
        <p className="text-warning">Selected Seat: {seat}</p>
      )}

        
        
      <input type="text" placeholder="Enter Phone(2547*********)" className="form-control mb-3" value={phone} onChange={(e) => setPhone(e.target.value)}/>
        
        
        
      
      <input type="number" placeholder="Enter Amount" className="form-control mb-3" value={amount} onChange={(e) => setAmount(e.target.value)}/>

        
        
        
        
        
      <input type="submit" value={"PAY"} className="btn btn-primary form-control" onClick={handlePayment}/>
      

    </div>
  )
}

export default Mpesa
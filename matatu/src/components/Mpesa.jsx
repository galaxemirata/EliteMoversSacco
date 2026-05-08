import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Mpesa = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const seat = location.state?.seat
  const from = location.state?.from || '/'

  const routeAmounts = {
    "/isiolo-karatina": 500,
    "/isiolo-mombasa": 1200,
    "/isiolo-nairobi": 1000,
    "/isiolo-nanyuki": 800,
    "/karatina-isiolo": 700,
    "/karatina-mombasa": 1500,
    "/karatina-nairobi": 400,
    "/karatina-nanyuki": 300,
    "/mombasa-isiolo": 1200,
    "/mombasa-karatina": 1500,
    "/mombasa-nairobi": 900,
    "/mombasa-nanyuki": 1300,
    "/nairobi-isiolo": 1000,
    "/nairobi-karatina": 400,
    "/nairobi-mombasa": 900,
    "/nairobi-nanyuki": 700,
    "/nanyuki-isiolo": 800,
    "/nanyuki-karatina": 300,
    "/nanyuki-mombasa": 1300,
    "/nanyuki-nairobi": 700,
  }

  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [pickup, setPickup] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutId, setCheckoutId] = useState(null)

  useEffect(() => {
    if (routeAmounts[from]) {
      setAmount(routeAmounts[from])
    }
  }, [from])

  // =========================
  // PAY FUNCTION
  // =========================
  const handlePayment = async () => {
    console.log("CHECKOUT ID:", checkoutId)

  if (!phone || !amount) {
    alert("Fill all fields")
    return
  }

  if (!/^2547\d{8}$/.test(phone)) {
    alert("Use format 2547XXXXXXXX")
    return
  }

  try {

    setLoading(true)

    const response = await fetch("http://localhost:5000/api/mpesa_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone,
        amount: Number(amount),
        seat,
        route: from,
        pickup_location: pickup
      })
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.error || "Payment failed")
      return
    }

    alert(data.message)

    // IMPORTANT
    setCheckoutId(data.checkout_id)

    // save seat locally
    const key = `paidSeats:${from}`
    const existing = JSON.parse(localStorage.getItem(key)) || []

    if (seat && !existing.includes(seat)) {
      localStorage.setItem(key, JSON.stringify([...existing, seat]))
    }

    // ❌ REMOVE NAVIGATION FROM HERE

  } catch (err) {

    console.log("ERROR:", err)
    alert("Payment unsuccessful...Kindly connect to a network")

  } finally {

    setLoading(false)

  }
}


  // =========================
  // CANCEL FUNCTION (FIXED)
  // =========================
  const handleCancel = async () => {

  if (!checkoutId) {
    alert("No active payment")
    return
  }

  try {

    const res = await fetch("http://localhost:5000/api/mpesa_cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        checkout_id: checkoutId
      })
    })

    const data = await res.json()

    alert(data.message)

    // reset checkout
    setCheckoutId(null)

    // remove seat from localStorage
    const key = `paidSeats:${from}`
    const existing = JSON.parse(localStorage.getItem(key)) || []

    const updated = existing.filter(s => s !== seat)

    localStorage.setItem(key, JSON.stringify(updated))

    // navigate back to route page
    navigate(from)

  } catch (err) {
    console.log(err)
    alert("Cancel failed")
  }
}
  return (
    <div className='row justify-content-center'>

      <div className="text-light p-4 card shadow col-md-6"
        style={{ borderRadius: 50 }}
        id='mpesacard'>

        <p className="text-white">
          M-Pesa Payment <b className='text-info'>{from}</b>
        </p>

        {seat && (
          <p className="text-warning">
            You selected seat {seat}
          </p>
        )}

        <input
          type="text"
          placeholder="Enter Phone (2547XXXXXXXX)"
          className="form-control mb-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        Amount is filled automatically
        <input
          type="number"
          className="form-control mb-3"
          value={amount}
          readOnly
        />

        <p>Kindly specify where you are standing</p>

        <textarea
          className='form-control mb-3'
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        ></textarea>

        {/* PAY BUTTON */}
        <button
          className="btn btn-info form-control"
          onClick={handlePayment}
          disabled={loading}
          style={{ borderRadius: 50 }}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            "PAY"
          )}
        </button>


        {/* BACK BUTTON */}
        <button
        className="btn btn-secondary form-control mt-2"
        onClick={() => navigate(from)}
        style={{ borderRadius: 50 }}
        >
        <b>BACK</b>
        </button>

        {/* CANCEL BUTTON */}
        {checkoutId && (
          <button
            className="btn btn-danger form-control mt-2"
            onClick={handleCancel}
            style={{ borderRadius: 50 }}
          >
            Stop Payment
          </button>
        )}

      </div>

    </div>
  )
}

export default Mpesa
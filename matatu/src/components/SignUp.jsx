import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {

  const navigate = useNavigate()

  // form states
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // ui states
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const submit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setSuccess("")
    setError("")

    try {
      const data = new FormData()
      data.append("username", username)
      data.append("email", email)
      data.append("password", password)
      data.append("phone", phone)

      const response = await axios.post(
        "http://127.0.0.1:5000/api/signup",
        data
      )

      setSuccess(response.data.message)

      // reset form
      setUsername("")
      setEmail("")
      setPassword("")
      setPhone("")

      setTimeout(() => {
        navigate("/booking")
      }, 1500)

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='row justify-content-center'>
      <div className='col-md-6 card shadow p-4 bg-info'>
        <h1><b>CREATE ACCOUNT</b></h1>

        <form onSubmit={submit}>

          {success && (
            <div className="alert alert-success d-flex align-items-center">
              <span className="me-2">✅</span>
              {success}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder='Enter your username'
            className='form-control'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />

          <input
            type="email"
            placeholder='Enter email'
            className='form-control'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          {/* Password with eye toggle */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Enter your password'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer"
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <br />

          <input
            type="tel"
            placeholder='Enter your phone number'
            className='form-control'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />


          <br />

          <button
            type="submit"
            className="btn bg-primary text-white w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing Up...
              </>
            ) : success ? (
              <>
                <span className="me-2">✅</span>
                Success
              </>
            ) : (
              "SignUp"
            )}
          </button>

          <br />
          <p>
            Already have an account? <Link to='/signin' className='text-white'><b>SignIn</b></Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default SignUp
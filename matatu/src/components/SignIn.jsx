import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading("Please wait...");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post(
        "http://127.0.0.1:5000/api/signin",
        formData
      );

      setLoading("");

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setSuccess(response.data.message);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(response.data.message);
      }

    } catch (error) {
      setLoading("");
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='row justify-content-center'>
      <div className='col-md-6 card shadow p-4 bg-info'>
        <h1><b>SignIn</b></h1>

        <form onSubmit={submit}>
          <p className='text-warning'>{loading}</p>
          <p className='text-success'>{success}</p>
          <p className='text-danger'>{error}</p>

          <input
            type="email"
            placeholder='Email'
            className='form-control'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          {/* Password with toggle */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Password'
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
              {showPassword ?  <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <br />

          <input
            type="submit"
            value="Sign In"
            className='form-control bg-primary text-white'
          />

          <br />

          <p>
            Don't have an account? <Link to='/signup' className='text-white'><b>SignUp</b></Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignIn
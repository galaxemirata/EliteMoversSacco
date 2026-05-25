import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email || !password) {
      setSuccess("");
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post(
        "http://127.0.0.1:5000/api/signin",
        formData
      );

      if (response?.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        localStorage.setItem(
          "username",
          response.data.user.username
        );

        // FIX: update App state instantly
        setUser(response.data.user);

        setSuccess(
          response.data.message || "Login successful"
        );

        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate("/");
        }, 1500);

      } else {
        setError(
          response.data.message ||
          "Invalid login credentials"
        );
      }

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-4">
      <div
        className="col-md-6 card shadow p-4"
        style={{ borderRadius: 30 }}
        id="signin"
      >
        <h3
          className="text-center text-info mb-4"
          id="signinhead"
        >
          Sign In
        </h3>

        <form onSubmit={submit}>
          {loading && (
            <p className="text-warning">
              Please wait...
            </p>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Enter Email"
            className="form-control"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <br />

          <div style={{ position: "relative" }}>
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter Password"
              className="form-control"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <span
              onClick={() =>
                setShowPassword(!showPassword)
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                cursor: "pointer"
              }}
            >
              {showPassword
                ? <FaEye />
                : <FaEyeSlash />}
            </span>
          </div>

          <br />

          <button
            type="submit"
            className="btn bg-info text-white w-100"
            style={{ borderRadius: 30 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <br />
          <br />

          <p className="text-dark">
            <b>Don't have an account?</b>
          </p>

          <Link
            to="/signup"
            className="text-primary"
          >
            <b>Sign Up</b>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
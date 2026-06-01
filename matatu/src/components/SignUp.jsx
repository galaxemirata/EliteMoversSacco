import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();

  // FORM STATES
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  // PASSWORD STRENGTH
  const [strength, setStrength] = useState("");
  const [strengthColor, setStrengthColor] = useState("");

  // UI STATES
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // PASSWORD CHECKER
  const checkPasswordStrength = (value) => {
    setPassword(value);

    if (value.length < 6) {
      setStrength("Weak Password");
      setStrengthColor("red");
    } else if (
      value.match(/[A-Z]/) &&
      value.match(/[0-9]/) &&
      value.match(/[@$!%*?&]/) &&
      value.length >= 8
    ) {
      setStrength("Strong Password");
      setStrengthColor("green");
    } else {
      setStrength("Medium Password");
      setStrengthColor("orange");
    }
  };

  // IMAGE TO BASE64
  const convertToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  // SUBMIT
  const submit = async (e) => {
    e.preventDefault();

    if (strength === "Weak Password") {
      setError("Please use a stronger password");
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      let imageBase64 = "";

      if (profilePic) {
        imageBase64 = await convertToBase64(profilePic);
      }

      const data = new FormData();

      data.append("username", username);
      data.append("email", email);
      data.append("password", password);
      data.append("phone", phone);
      data.append("profilePic", imageBase64)

      await axios.post(
        "http://127.0.0.1:5000/api/signup",
        data
      );

      // SAVE USER
      const userData = {
        username,
        email,
        phone,
        profilePic: imageBase64,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      setSuccess(`Welcome ${username}`);

      // RESET
      setUsername("");
      setEmail("");
      setPassword("");
      setPhone("");
      setStrength("");
      setProfilePic(null);

      setTimeout(() => {
        navigate("/signin");
      }, 1500);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div
        className="col-md-6 card shadow p-4"
        style={{ borderRadius: 50 }}
        id="signup"
      >
        <p>
          <b id="createaccount">CREATE ACCOUNT</b>
        </p>

        <form onSubmit={submit}>
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
            type="text"
            placeholder="Enter your username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <br />

          <input
            type="email"
            placeholder="Enter email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          {/* PROFILE PICTURE */}
          <p className="text-info">Kindly select Profile photo</p>
          <input
            type="file"
            className="form-control text-danger"
            accept="image/*"
            onChange={(e) =>
              setProfilePic(e.target.files[0])
            }
          />

          <br />

          {/* PASSWORD */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="form-control"
              value={password}
              onChange={(e) =>
                checkPasswordStrength(e.target.value)
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
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? (
                <FaEye />
              ) : (
                <FaEyeSlash />
              )}
            </span>
          </div>

          {/* PASSWORD STRENGTH */}
          {password && (
            <small
              style={{
                color: strengthColor,
                fontWeight: "bold",
              }}
            >
              {strength}
            </small>
          )}

          <br />
          <br />

          <input
            type="tel"
            placeholder="Enter your phone number"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <br />

          <button
            type="submit"
            className="btn bg-info text-white w-100"
            disabled={loading}
            style={{ borderRadius: 30 }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing Up...
              </>
            ) : success ? (
              "Success"
            ) : (
              "SignUp"
            )}
          </button>

          <br />
          <br />

          <p className="text-white">
            <b>Already have an account?</b>
          </p>

          <Link to="/signin">
            <b>SignIn</b>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
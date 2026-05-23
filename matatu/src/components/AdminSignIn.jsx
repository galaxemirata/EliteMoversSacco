import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminSignIn = ({ setAdmin }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState("")

    const navigate = useNavigate()

    const submit = async (e) => {

        e.preventDefault()

        setLoading("Please wait...")
        setError("")

        try {

            const formData = new FormData()

            formData.append("email", email)
            formData.append("password", password)

            const response = await axios.post(
                "http://127.0.0.1:5000/api/adminsignin",
                formData
            )

            setLoading("")

            if (response.data.success) {

                // SAVE ADMIN SESSION
                localStorage.setItem(
                    "admin",
                    JSON.stringify(response.data.admin)
                )

                // UPDATE REACT STATE
                setAdmin(response.data.admin)

                // NAVIGATE WITHOUT RELOAD
                navigate("/admin")

            } else {

                setError(response.data.message)
            }

        } catch (error) {

            setLoading("")
            setError("Login failed")
        }
    }

    return (

        <div className='row justify-content-center mt-5'>

            <div className='col-md-5 card shadow p-4'>

                <h2 className='text-center text-info'>
                    Admin Sign In
                </h2>

                <form onSubmit={submit}>

                    <p className='text-warning'>{loading}</p>

                    <p className='text-danger'>{error}</p>

                    <input
                        type="email"
                        placeholder='Admin Email'
                        className='form-control'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <br />

                    <input
                        type="password"
                        placeholder='Password'
                        className='form-control'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <br />

                    <button
                        type='submit'
                        className='btn btn-info w-100 text-white'
                    >
                        Sign In
                    </button>

                </form>

            </div>

        </div>
    )
}

export default AdminSignIn
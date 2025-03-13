import React, { useState } from "react";
import LoginCarousel from "./LoginCarousel";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";




const Signup = () => {
    return (
        <div className="w-full h-screen grid grid-cols-3">
            <LoginCarousel />
            <SignupForm />
        </div>
    );
};

const SignupForm = () => {

    const [credentials, setCredentials] = useState({ fullname: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/auth/signup`, credentials);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };
    const [showPassword, setShowPassword] = useState(false);
    // const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="h-full w-full col-span-1 flex flex-col justify-center items-start px-8 text-[#203d5d]">
            <form className="space-y-6 w-full max-w-sm" onSubmit={handleSubmit}>
                {/* Full Name Field */}
                <div>
                    <label htmlFor="fullname" className="block text-sm font-medium">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your full name"
                        required
                        value={credentials.fullname}
                        onChange={handleChange}
                    />
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your email"
                        required
                        value={credentials.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Password Field */}
                <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium">
                        Password
                    </label>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your password"
                            required
                            value={credentials.password}
                            onChange={handleChange}
                        />
                        <span
                            className="absolute top-1/2 -translate-y-1/2 text-xl right-0 pr-3 flex justify-center items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </span>
                    </div>

                </div>

                {/* Confirm Password Field */}
                {/* <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium">
                        Confirm Password
                    </label>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Confirm your password"
                            required
                            value={credentials.confirmPassword}
                            onChange={credentialsChangeHandler}
                        />
                        <span
                            className="absolute top-1/2 -translate-y-1/2 text-xl right-0 pr-3 flex justify-center items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </span>
                    </div>

                </div> */}

                {/* Signup Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#203d5d] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign Up
                    </button>
                </div>

                {/* Already have an account? Link to Login */}
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/login")}>
                        Log in
                    </span>
                </div>
            </form>
        </div>
    );
};

export default Signup;


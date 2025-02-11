import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../Store/authslice';
import Button from './Button';
import Input from './Input';
import Logo from './Logo';
import { useDispatch } from "react-redux";
import apiService from '../Backend/userauth';
import { useForm } from "react-hook-form";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [serverError, setServerError] = useState("");
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'username'

    const login = async (data) => {
        setServerError("");
        try {
            const credentials = loginMethod === 'email' 
                ? { email: data.identifier, password: data.password }
                : { username: data.identifier, password: data.password };

            const session = await apiService.loginUser(credentials);
            if (session) {
                const userData = await apiService.getCurrentUser();
                if (userData) dispatch(authLogin(userData));
                navigate("/");
            }
        } catch (error) {
            setServerError(error || "An error occurred during login");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-700/30 ring-1 ring-gray-700/50">
                <div className="mb-6 flex justify-center">
                    <div className="p-3 bg-green-500/10 rounded-xl border border-green-400/20">
                        <Logo className="h-12 w-12 text-green-400" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-300">
                    Welcome Back
                </h2>
                <p className="mt-3 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-medium text-green-400 hover:text-teal-300 transition-colors"
                    >
                        Sign Up
                    </Link>
                </p>

                {serverError && (
                    <p className="text-red-400 mt-4 text-center text-sm">
                        {serverError}
                    </p>
                )}

                <div className="mt-6 flex gap-4 justify-center">
                    <button
                        type="button"
                        onClick={() => setLoginMethod('email')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${loginMethod === 'email' 
                                ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                                : 'text-gray-400 hover:bg-gray-700/50'}`}
                    >
                        Use Email
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginMethod('username')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${loginMethod === 'username' 
                                ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                                : 'text-gray-400 hover:bg-gray-700/50'}`}
                    >
                        Use Username
                    </button>
                </div>

                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-6">
                        <Input
                            label={loginMethod === 'email' ? "Email" : "Username"}
                            placeholder={loginMethod === 'email' 
                                ? "Enter your email" 
                                : "Enter your username"}
                            variant="dark"
                            {...register("identifier", {
                                required: "This field is required",
                                pattern: loginMethod === 'email' ? {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Please enter a valid email"
                                } : undefined
                            })}
                            error={errors.identifier?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            variant="dark"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            error={errors.password?.message}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-400 to-teal-300 hover:from-green-500 hover:to-teal-400 text-gray-900 font-bold py-3 rounded-lg transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing In..." : "Continue"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;

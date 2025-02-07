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

    const login = async (data) => {
        setServerError("");
        try {
            const session = await apiService.loginUser(data);
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
        <div className='flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'>
            <div className="mx-auto w-full max-w-lg bg-gray-800/80 backdrop-blur-lg rounded-xl p-10 border border-gray-700 shadow-2xl">
                <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-blue-900/30 rounded-xl border border-blue-400/20">
                        <Logo className="h-16 w-auto text-blue-200" />
                    </div>
                </div>
                
                <h2 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200">
                    Welcome Back to finask
                </h2>
                
                <p className="mt-3 text-center text-sm text-gray-400">
                    Don't have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent
                                  hover:brightness-125 transition-all duration-300"
                    >
                        Create Account
                    </Link>
                </p>

                {serverError && (
                    <div className="mt-6 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                        <p className="text-red-400 text-sm text-center">{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-6'>
                        <Input
                            label="Email"
                            placeholder="ashish@finask.co.in"
                            type="email"
                            labelClassName="text-blue-100"
                            className="bg-gray-700/50 border-gray-600 focus:border-blue-400 focus:ring-blue-400/50 text-white"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Invalid email address",
                                },
                            })}
                            error={errors.email?.message}
                        />

                        <Input
                            label="Enrollment Number"
                            placeholder="Enter your enrollment"
                            type="text"
                            labelClassName="text-blue-100"
                            className="bg-gray-700/50 border-gray-600 focus:border-blue-400 focus:ring-blue-400/50 text-white"
                            {...register("enroll", {
                                required: "Enrollment number is required",
                            })}
                            error={errors.enroll?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            labelClassName="text-blue-100"
                            className="bg-gray-700/50 border-gray-600 focus:border-blue-400 focus:ring-blue-400/50 text-white"
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
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                                      text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-blue-lg
                                      transform hover:scale-[1.02]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Authenticating..." : "Log in"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;

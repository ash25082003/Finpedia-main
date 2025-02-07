import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../Store/authslice';
import Button from './Button';
import Input from './Input';
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
        <div className='flex items-center justify-center w-full min-h-screen bg-[#1a1f24]'>
            <div className="mx-auto w-full max-w-lg bg-[#1e2329] rounded-xl p-10 border border-[#2d3339] shadow-xl">
                <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-[#2ecc71]/10 rounded-xl border border-[#2ecc71]/20">
                        <img 
                            src="https://lh3.googleusercontent.com/a/ACg8ocIMzqSpIMzVkERQQWpFT4eJ4lwyapyXQuji_vsz9DmLScg5nzVj=s360-c-no" 
                            alt="Finask Logo"
                            className="h-16 w-auto rounded-lg"
                            width="64"
                            height="64"
                        />
                    </div>
                </div>
                
                <h2 className="text-center text-3xl font-bold text-gray-100">
                    Welcome Back to finask
                </h2>
                
                <p className="mt-3 text-center text-sm text-gray-400">
                    Don't have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-[#2ecc71] hover:text-[#27ae60] transition-colors duration-200"
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
                    <div className='space-y-5'>
                        <Input
                            label="Email"
                            placeholder="ashish@finask.co.in"
                            type="email"
                            labelClassName="text-white"
                            className="w-full bg-[#1e2329] border-2 border-[#3d444b] focus:border-[#2ecc71] focus:ring-[#2ecc71]/30 
                                      text-white placeholder:text-[#5c636a] rounded-lg px-4 py-3"
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
                            labelClassName="text-white"
                            className="w-full bg-[#1e2329] border-2 border-[#3d444b] focus:border-[#2ecc71] focus:ring-[#2ecc71]/30 
                                      text-white placeholder:text-[#5c636a] rounded-lg px-4 py-3"
                            {...register("enroll", {
                                required: "Enrollment number is required",
                            })}
                            error={errors.enroll?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            labelClassName="text-white"
                            className="w-full bg-[#1e2329] border-2 border-[#3d444b] focus:border-[#2ecc71] focus:ring-[#2ecc71]/30 
                                      text-white placeholder:text-[#5c636a] rounded-lg px-4 py-3"
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
                        className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-gray-900 font-semibold py-3 rounded-lg 
                                transition-all duration-200 hover:shadow-lg hover:shadow-[#2ecc71]/20
                                border-2 border-transparent hover:border-[#27ae60]"
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

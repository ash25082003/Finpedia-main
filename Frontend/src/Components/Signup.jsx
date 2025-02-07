import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import apiService from "../Backend/userauth";
import Button from "./Button";
import Input from "./Input";
import Logo from "./Logo";

function Signup() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const createAccount = async (data) => {
        setServerError("");
        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("email", data.email);
            formData.append("enroll", data.enroll);
            formData.append("password", data.password);
            
            await apiService.registerUser(formData);
            navigate("/");
        } catch (error) {
            setServerError(error || "An error occurred during signup.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1a1f24]">
            <div className="mx-auto w-full max-w-lg bg-[#1e2329] rounded-xl p-10 shadow-xl border border-[#2d3339]">
                <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-[#2ecc71]/10 rounded-xl border border-[#2ecc71]/20">
                        <Logo className="h-16 w-auto text-[#2ecc71]" />
                    </div>
                </div>
                
                <h2 className="text-center text-3xl font-bold text-gray-100">
                    Create Your Account
                </h2>
                
                <p className="mt-3 text-center text-sm text-gray-400">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-[#2ecc71] hover:text-[#27ae60] transition-colors duration-200"
                    >
                        Sign In
                    </Link>
                </p>

                {serverError && (
                    <div className="mt-6 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                        <p className="text-red-400 text-sm text-center">{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(createAccount)} className="mt-8">
                    <div className="space-y-5">
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            labelClassName="text-gray-300"
                            className="w-full bg-[#2d3339] border-[#3d444b] focus:border-[#2ecc71] focus:ring-[#2ecc71]/30 
                                      text-gray-100 placeholder:text-[#5c636a] rounded-lg px-4 py-3"
                            {...register("fullName", {
                                required: "Full name is required",
                                minLength: {
                                    value: 3,
                                    message: "Full name must be at least 3 characters long",
                                },
                            })}
                            error={errors.fullName?.message}
                        />
                        
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            labelClassName="text-gray-300"
                            className="w-full bg-[#2d3339] border-[#3d444b] focus:border-[#2ecc71] focus:ring-[#2ecc71]/30 
                                      text-gray-100 placeholder:text-[#5c636a] rounded-lg px-4 py-3"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Please enter a valid email address",
                                },
                            })}
                            error={errors.email?.message}
                        />
                        
                        <Input
                            label="Enrollment Number"
                            placeholder="Enter your enrollment number"
                            labelClassName="text-gray-300"
                            className="w-full bg-[#2d3339] border-[#3d444b] focus:border-[#2ecc71] focus:ring-[#2ecc71]/30 
                                      text-gray-100 placeholder:text-[#5c636a] rounded-lg px-4 py-3"
                            {...register("enroll", {
                                required: "Enrollment number is required",
                                minLength: {
                                    value: 6,
                                    message: "Enrollment number must be valid",
                                },
                            })}
                            error={errors.enroll?.message}
                        />
                        
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            labelClassName="text-gray-300"
                            className="w-full bg-[#2d3339] border-[#3d444b] focus:border-[#2ecc71] focus:ring-[#2ecc71]/30 
                                      text-gray-100 placeholder:text-[#5c636a] rounded-lg px-4 py-3"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long",
                                },
                            })}
                            error={errors.password?.message}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-gray-900 font-semibold py-3 rounded-lg 
                                    transition-all duration-200 hover:shadow-lg hover:shadow-[#2ecc71]/20"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;

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
            formData.append("username", data.username);
            formData.append("password", data.password);
            await apiService.registerUser(formData);
            navigate("/");
        } catch (error) {
            setServerError(error || "An error occurred during signup.");
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
                    Join FInpedia
                </h2>
                <p className="mt-3 text-center text-sm text-gray-400">
                    Already part of our community?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-green-400 hover:text-teal-300 transition-colors"
                    >
                        Sign In
                    </Link>
                </p>

                {serverError && (
                    <p className="text-red-400 mt-4 text-center text-sm">
                        {serverError}
                    </p>
                )}

                <form onSubmit={handleSubmit(createAccount)} className="mt-8">
                    <div className="space-y-6">
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            variant="dark"
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
                            variant="dark"
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
                            label="Username"
                            placeholder="Enter your username"
                            variant="dark"
                            {...register("username", {
                                required: "Username is required",
                                minLength: {
                                    value: 6,
                                    message: "Username must be valid",
                                },
                            })}
                            error={errors.enroll?.message}
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
                                    message: "Password must be at least 6 characters long",
                                },
                            })}
                            error={errors.password?.message}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-400 to-teal-300 hover:from-green-500 hover:to-teal-400 text-gray-900 font-bold py-3 rounded-lg transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating Account..." : "Join"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;

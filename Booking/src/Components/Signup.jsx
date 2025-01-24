import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm , FormData } from "react-hook-form";
import apiService from "../Bckend/userauth";// Updated import for apiService
import Button from "./Button";
import Input from "./Input";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Store/authslice";

function AdminSignupComp() {
    const admindetail = useSelector((state) => state.auth.adminData);
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const createAdminAccount = async (data) => {
        setServerError(""); // Reset any previous errors
        try {
            console.log(data)
            // Use FormData for API request
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("email", data.email);
            formData.append("enroll", data.enroll);
            formData.append("password", data.password);
            console.log(formData)
            // Call registerUser API for admin signup
            const admin = await apiService.registerUser(formData);

            if (admin) {
                // Fetch the current admin details
                const adminData = await apiService.getCurrentUser();

                if (adminData) {
                    // Dispatch login action to Redux store
                    dispatch(login({ adminData }));

                    // Navigate to admin dashboard upon successful signup
                    navigate("/admin-dash");
                }
            }
        } catch (error) {
            setServerError(error.message || "An error occurred during signup.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-lg bg-white rounded-xl p-10 shadow-md border border-gray-200">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold">
                    Create Admin Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {serverError && (
                    <p className="text-red-600 mt-4 text-center">
                        {serverError}
                    </p>
                )}
                <form onSubmit={handleSubmit(createAdminAccount)} className="mt-8">
                    <div className="space-y-5">
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
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
                            className="w-full"
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

export default AdminSignupComp;

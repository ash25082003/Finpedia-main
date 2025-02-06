const BASE_URL = "http://localhost:8000/api/v1";

const apiService = {
    async registerUser(formData) {
        try {
            console.log(formData)
            const response = await fetch(`${BASE_URL}/users/register`, {
                method: "POST",
                credentials: "include", // Sends cookies with the request
                body: formData, // FormData object for file uploads
            });
            console.log(response)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Registration failed";
        }
    },

    async loginUser({ email, enroll, password }) {
        try {
            const response = await fetch(`${BASE_URL}/users/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, enroll, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Login failed";
        }
    },

    async logoutUser() {
        try {
            const response = await fetch(`${BASE_URL}/users/logout`, {
                method: "POST",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Logout failed");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Logout failed";
        }
    },

    async changePassword(oldPassword, newPassword) {
        try {
            const response = await fetch(`${BASE_URL}/users/change-password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to change password");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to change password";
        }
    },

    async getCurrentUser() {
        try {
            const response = await fetch(`${BASE_URL}/users/current-user`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch user details");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to fetch user details";
        }
    },

    async updateUserDetails(fullName, email) {
        try {
            const response = await fetch(`${BASE_URL}/users/update-account`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fullName, email }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update account details");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to update account details";
        }
    },
};

export default apiService;

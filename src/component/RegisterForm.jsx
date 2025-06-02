import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ ใช้ API_URL ให้ตรงกับ .env
const API_URL = import.meta.env.VITE_API_URL;

let debounceTimer;

function RegisterForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const username_pattern = /^[a-zA-Z0-9_]{3,20}$/;
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const checkDuplicate = async (field, value) => {
    if (!value) return "";
    try {
      const res = await axios.post(`${API_URL}/auth/check-duplicate`, {
        [field]: value,
      });
      return res.data.exists ? `${field} already exists.` : "";
    } catch (err) {
      console.error("❌ Duplicate check error:", err);
      return "Could not check duplicate.";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const newErrors = { ...errors };

      if (name === "username") {
        if (!username_pattern.test(value)) {
          newErrors.username =
            "Username must be 3-20 characters and only letters, numbers, underscores.";
        } else {
          newErrors.username = await checkDuplicate("username", value);
        }
      }

      if (name === "email") {
        if (!email_pattern.test(value)) {
          newErrors.email = "Email is invalid.";
        } else {
          newErrors.email = await checkDuplicate("email", value);
        }
      }

      if (name === "password") {
        newErrors.password = password_pattern.test(value)
          ? ""
          : "Password must contain at least one letter, one number, and be at least 6 characters long.";
      }

      setErrors(newErrors);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalErrors = {
      username: !form.username.trim()
        ? "Username is required"
        : errors.username || "",
      email: !form.email.trim()
        ? "Email is required"
        : errors.email || "",
      password: !form.password.trim()
        ? "Password is required"
        : password_pattern.test(form.password)
          ? ""
          : "Password must contain at least one letter, one number, and be at least 6 characters long.",
    };

    if (Object.values(finalErrors).some((err) => err)) {
      setErrors(finalErrors);
      return;
    }

    try {
      console.log("API_URL =>", API_URL);
      const res = await axios.post(`${API_URL}/auth/register`, form);
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error("❌ Register failed:", err.response?.data || err);
      alert("Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create an Account</h2>

        <div className="space-y-4">
          <div>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className={`w-full px-4 py-2 border ${errors.username ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full px-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full px-4 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-sm transition duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;

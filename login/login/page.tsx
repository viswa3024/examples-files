"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) setError("Invalid email or password");
    else alert(`Logged in as ${email}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section */}
      <div className="w-1/2 bg-[#3A9BDC] flex flex-col justify-center items-center text-white px-10">
        <div className="max-w-sm text-center">
          <img src="/illustration.svg" alt="i2c Careers" className="mb-6" />
          <h1 className="text-2xl font-semibold mb-3">
            Welcome to i2c Careers Portal
          </h1>
          <p className="text-sm opacity-90 mb-10">
            Log in to update your personal information, check your application
            status, or communicate with our hiring team.
          </p>
          <div className="flex justify-around text-sm">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center mb-2">
                ✓
              </div>
              Apply for Jobs
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center mb-2">
                ✓
              </div>
              Manage your account
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center mb-2">
                ✓
              </div>
              Status of your application
            </div>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="text-2xl font-bold">i2c</div>
            <div className="text-2xl font-bold text-blue-600">Careers</div>
          </div>

          <h2 className="text-xl font-semibold mb-4">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Address *</label>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password *</label>
              <input
                type="password"
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Remember Password?
              </label>
              <button
                type="button"
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#F79B25] text-white py-2 rounded-md font-semibold hover:opacity-90 transition"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

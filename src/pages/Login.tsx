"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from 'lucide-react' // Import Lucide icons

export default function Login() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // New loading state
  const [error, setError] = useState<string | null>(null) // New error state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
    if (error) {
      setError(null) // Clear error on input change
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token (e.g., in localStorage)
        localStorage.setItem("userToken", data.token)
        // Store user info if needed
        localStorage.setItem("userInfo", JSON.stringify(data.user))

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in. Redirecting to questionnaire...",
        })
        setTimeout(() => {
          navigate("/questionnaire")
        }, 1500) // Shorten delay for better UX
      } else {
        setError(data.message || "Login failed. Please check your credentials.")
        toast({
          title: "Login Failed",
          description: data.message || "Invalid email or password.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Network error or server is unreachable.")
      toast({
        title: "Error",
        description: "Could not connect to the server. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#1A1A1A] px-[80px] py-[40px] flex items-center justify-center">
      <div className="flex items-center justify-center gap-[120px]">
        {/* Left Side - Text Content */}
        <div className="flex items-center justify-center">
          <div className="w-[600px] flex flex-col justify-center">
            <h1 className="text-white text-[50px] font-['Questrial'] font-normal leading-tight text-center">
              Welcome back!
              <br />
              Sign in to your
              <br />
              account
            </h1>
          </div>
        </div>
        {/* Right Side - Login Form */}
        <div className="px-[40px] py-[50px] bg-[#242424] flex items-center gap-[10px] rounded-[20px]">
          <div className="w-[486px] flex flex-col gap-[30px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[35px]">
              <div className="flex flex-col gap-[25px]">
                {/* Email Address */}
                <div className="h-[64px] px-[25px] py-[25px] bg-[#E0E3E4] rounded-[16px] flex items-end">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent text-[#707172] text-[15px] font-['Poppins'] font-medium placeholder-[#707172] border-none outline-none"
                  />
                </div>
                {/* Password */}
                <div className="h-[64px] px-[25px] py-[25px] bg-[#E0E3E4] rounded-[16px] flex justify-between items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="flex-1 bg-transparent text-[#707172] text-[15px] font-['Poppins'] font-medium placeholder-[#707172] border-none outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#707172] hover:text-[#555] focus:outline-none ml-2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 accent-[#619E7A] rounded" />
                  <label htmlFor="remember" className="text-[13px] text-[#707172] font-['Poppins']">
                    Remember me
                  </label>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {/* Bottom Buttons */}
              <div className="flex items-center gap-[16px]">
                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-[46px] p-[16px] bg-[#619E7A] rounded-[14px] flex justify-center items-center gap-[8px] hover:bg-[#5a8f6f] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-[#D9D9D9] text-[15px] font-['Poppins'] font-medium">
                    {isLoading ? "Signing In..." : "Sign In"}
                  </div>
                </button>
                {/* Register Button */}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  disabled={isLoading}
                  className="flex-1 h-[46px] p-[16px] bg-[rgba(177.64,177.64,177.64,0.15)] rounded-[14px] flex justify-center items-center gap-[8px] hover:bg-[rgba(177.64,177.64,177.64,0.25)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-[#E3E3E3] text-[15px] font-['Poppins'] font-medium">Create Account</div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
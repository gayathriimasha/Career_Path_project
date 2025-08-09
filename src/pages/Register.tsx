"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from 'lucide-react' // Import Lucide icons

export default function Register() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // New loading state
  const [error, setError] = useState<string | null>(null) // New error state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null) // Clear error on input change
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to our community. Redirecting to login...",
        })
        setTimeout(() => {
          navigate("/login") // Redirect to login after successful registration
        }, 1500) // Shorten delay
      } else {
        setError(data.message || "Registration failed. Please try again.")
        toast({
          title: "Registration Failed",
          description: data.message || "An error occurred during registration.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Registration error:", err)
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

  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <div className="min-h-screen w-full bg-[#1A1A1A] overflow-hidden px-[80px] py-[40px]">
      <div className="flex items-start gap-[120px] mt-[40px]">
        {/* Left Side - Text Content */}
        <div className="pt-[40px] flex items-center justify-center">
          <div className="w-[600px] flex flex-col justify-end">
            <h1 className="text-white text-[50px] font-['Questrial'] font-normal leading-tight">
              Ready to explore?
              <br />
              Create your free account now!
            </h1>
          </div>
        </div>
        {/* Right Side - Registration Form */}
        <div className="px-[40px] py-[50px] bg-[#242424] flex items-center gap-[10px] rounded-[20px]">
          <div className="w-[486px] flex flex-col gap-[30px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[35px]">
              {/* Form Fields */}
              <div className="flex flex-col gap-[25px]">
                {/* Full Name */}
                <div className="h-[64px] px-[25px] py-[25px] bg-[#E0E3E4] rounded-[16px] flex items-end">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent text-[#707172] text-[15px] font-['Poppins'] font-medium placeholder-[#707172] border-none outline-none"
                    placeholder="Full Name"
                  />
                </div>
                {/* NIC */}
                <div className="h-[64px] px-[25px] py-[25px] bg-[#E0E3E4] rounded-[16px] flex items-end">
                  <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent text-[#707172] text-[15px] font-['Poppins'] font-medium placeholder-[#707172] border-none outline-none"
                    placeholder="NIC"
                  />
                </div>
                {/* Email Address */}
                <div className="h-[64px] px-[25px] py-[25px] bg-[#E0E3E4] rounded-[16px] flex items-end">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent text-[#707172] text-[15px] font-['Poppins'] font-medium placeholder-[#707172] border-none outline-none"
                    placeholder="Email Address"
                  />
                </div>
                {/* Phone Number */}
                <div className="h-[64px] px-[25px] py-[25px] bg-[#E0E3E4] rounded-[16px] flex items-end">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent text-[#707172] text-[15px] font-['Poppins'] font-medium placeholder-[#707172] border-none outline-none"
                    placeholder="Phone Number"
                  />
                </div>
                {/* Password */}
                <div className="h-[75px] px-[29px] py-[30px] bg-[#E0E3E4] rounded-[20px] flex justify-between items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="flex-1 bg-transparent text-[#707172] text-[15px] font-['Poppins'] font-medium placeholder-[#707172] border-none outline-none"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#707172] hover:text-[#555] focus:outline-none ml-2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Confirm Password */}
                <div className="h-[75px] px-[29px] py-[30px] bg-[#E0E3E4] rounded-[20px] flex justify-between items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="flex-1 bg-transparent text-[#707172] text-[15px] font-['Poppins'] font-medium placeholder-[#707172] border-none outline-none"
                    placeholder="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#707172] hover:text-[#555] focus:outline-none ml-2"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {/* Bottom Buttons */}
              <div className="flex items-center gap-[16px]">
                {/* Login Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="flex-1 h-[46px] p-[16px] bg-[rgba(177.64,177.64,177.64,0.15)] rounded-[14px] flex justify-center items-center gap-[8px] hover:bg-[rgba(177.64,177.64,177.64,0.25)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-[#E3E3E3] text-[15px] font-['Poppins'] font-medium">Enter your account</div>
                </button>
                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-[46px] p-[16px] bg-[#619E7A] rounded-[14px] flex justify-center items-center gap-[8px] hover:bg-[#5a8f6f] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-[#D9D9D9] text-[15px] font-['Poppins'] font-medium">
                    {isLoading ? "Registering..." : "Join the Community"}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
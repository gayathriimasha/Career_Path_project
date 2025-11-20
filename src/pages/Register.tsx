import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Home } from 'lucide-react'
import { motion } from "framer-motion"

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          nic: "N/A",
          phoneNumber: "N/A"
        }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate("/login")
      } else {
        setError(data.message || "Registration failed. Please try again.")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("Network error or server is unreachable.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700"
          >
            <Home size={20} />
            <span className="text-sm font-['Poppins']">Back to Home</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
              <span className="text-sm text-[#ABE6C4] font-['Poppins'] uppercase tracking-wide">Join Us</span>
              <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
            </div>
            <h1 className="text-4xl font-['Questrial'] mb-3">Create your account</h1>
            <p className="text-gray-400 font-['Poppins']">Start your career discovery journey today</p>
          </div>

          <div className="p-8 rounded-2xl bg-black/30 border border-gray-800">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[60px] px-[19px] py-[22px] rounded-[15px] bg-[#1f1f1f] border border-gray-700 outline-none text-white text-[17px] font-normal font-['Questrial'] box-border focus:border-[#ABE6C4] focus:bg-[#252525] transition-all duration-300 placeholder:text-gray-500"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[60px] px-[19px] py-[22px] rounded-[15px] bg-[#1f1f1f] border border-gray-700 outline-none text-white text-[17px] font-normal font-['Questrial'] box-border focus:border-[#ABE6C4] focus:bg-[#252525] transition-all duration-300 placeholder:text-gray-500"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[60px] px-[19px] py-[22px] rounded-[15px] bg-[#1f1f1f] border border-gray-700 outline-none text-white text-[17px] font-normal font-['Questrial'] box-border focus:border-[#ABE6C4] focus:bg-[#252525] transition-all duration-300 placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[60px] px-[19px] py-[22px] rounded-[15px] bg-[#1f1f1f] border border-gray-700 outline-none text-white text-[17px] font-normal font-['Questrial'] box-border focus:border-[#ABE6C4] focus:bg-[#252525] transition-all duration-300 placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                  <p className="text-sm font-['Poppins']">{error}</p>
                </div>
              )}

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] text-black font-['Poppins'] font-semibold hover:shadow-2xl hover:shadow-[#ABE6C4]/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <span className="text-gray-400 font-['Poppins'] text-sm">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#ABE6C4] font-['Poppins'] text-sm hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
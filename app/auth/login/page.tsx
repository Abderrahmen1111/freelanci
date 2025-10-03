"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "", // Ajoute ce champ
    remember: false,
  })
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    try {
      // Prépare l'objet à envoyer
      const payload = {
        username: formData.email, // Utilise l'email comme username
        password: formData.password,
      }
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/`, payload)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userType", res.data.userType)
      router.push(res.data.userType === "client" ? "/client-dashboard" : "/freelancer-dashboard")
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMsg(
          typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data)
        )
      } else {
        setErrorMsg("Erreur lors de la connexion.")
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-green-900/80"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
            }}
            animate={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>

          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-gradient-to-r from-red-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    rotate: 360,
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                  }}
                  style={{ borderRadius: "50%" }}
                />
                <motion.span
                  className="text-white font-bold text-xl relative z-10"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(255,255,255,0.5)",
                      "0 0 20px rgba(255,255,255,0.8)",
                      "0 0 10px rgba(255,255,255,0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  Fi
                </motion.span>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">Connexion</CardTitle>
              <p className="text-white/70">Accédez à votre compte Freelancii.tn</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <label className="text-sm font-medium text-white/90">Email</label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    required
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <label className="text-sm font-medium text-white/90">Mot de passe</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.remember}
                      onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
                      className="border-white/20 data-[state=checked]:bg-green-600"
                    />
                    <label htmlFor="remember" className="text-sm text-white/80">
                      Se souvenir de moi
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-white/80 hover:text-white">
                    Mot de passe oublié ?
                  </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white font-semibold py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </motion.div>
              </form>

              {errorMsg && (
                <div className="bg-red-100 text-red-800 p-2 rounded mt-4 text-center">
                  {errorMsg}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <p className="text-white/70">
                  Pas encore de compte ?{" "}
                  <Link href="/auth/register" className="text-white font-semibold hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </motion.div>

              {/* Quick Login Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-2 pt-4 border-t border-white/20"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    localStorage.setItem("isAuthenticated", "true")
                    localStorage.setItem("userType", "client")
                    router.push("/client-dashboard")
                  }}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Client
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    localStorage.setItem("isAuthenticated", "true")
                    localStorage.setItem("userType", "freelancer")
                    router.push("/freelancer-dashboard")
                  }}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Freelancer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    localStorage.setItem("isAuthenticated", "true")
                    localStorage.setItem("userType", "admin")
                    router.push("/admin-dashboard")
                  }}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Admin
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowLeft, User, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    skills: "",
    experience: "",
    location: "",
    acceptTerms: false,
  })
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      return
    }

    setIsLoading(true)
    setSuccessMsg("")
    setErrorMsg("")
    try {
      // Prépare l'objet à envoyer
      const payload = {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        userType: formData.userType,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        company: formData.company,
        skills: formData.skills,
        experience: formData.experience,
        location: formData.location,
        acceptTerms: formData.acceptTerms,
      }
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register/`, payload)
      setSuccessMsg("Utilisateur ajouté avec succès !")
      setTimeout(() => {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userType", formData.userType)
        router.push(formData.userType === "client" ? "/client-dashboard" : "/freelancer-dashboard")
      }, 2000)
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMsg(
          typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data)
        )
      } else {
        setErrorMsg("Erreur lors de la création du compte.")
      }
    }
    setIsLoading(false)
  }

  const userTypes = [
    { value: "client", label: "Client", icon: Building, description: "Je cherche des freelancers" },
    { value: "freelancer", label: "Freelancer", icon: User, description: "Je propose mes services" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-green-900/80"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
            }}
            animate={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
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
          className="w-full max-w-lg"
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
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
                      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%)",
                      "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.span
                  className="text-white font-bold text-xl relative z-10"
                  animate={{
                    y: [0, -2, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  Fi
                </motion.span>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">Créer un compte</CardTitle>
              <p className="text-white/70">Rejoignez la communauté Freelancii.tn</p>

              {/* Progress Bar */}
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-2 rounded-full transition-colors ${i <= step ? "bg-green-500" : "bg-white/20"}`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: User Type */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-lg font-semibold text-white text-center">Quel est votre profil ?</h3>
                    <div className="grid gap-4">
                      {userTypes.map((type) => (
                        <motion.div key={type.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, userType: type.value })}
                            className={`w-full p-4 rounded-lg border-2 transition-all ${
                              formData.userType === type.value
                                ? "border-green-500 bg-green-500/20"
                                : "border-white/20 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <type.icon className="h-8 w-8 text-white" />
                              <div className="text-left">
                                <h4 className="font-semibold text-white">{type.label}</h4>
                                <p className="text-sm text-white/70">{type.description}</p>
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Personal Info */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-lg font-semibold text-white text-center">Informations personnelles</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-white/90">Prénom</label>
                        <Input
                          placeholder="Ahmed"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white/90">Nom</label>
                        <Input
                          placeholder="Ben Ali"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white/90">Email</label>
                      <Input
                        type="email"
                        placeholder="ahmed@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white/90">Téléphone</label>
                      <Input
                        placeholder="+216 XX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white/90">Localisation</label>
                      <Select onValueChange={(value) => setFormData({ ...formData, location: value })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Sélectionner votre ville" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tunis">Tunis</SelectItem>
                          <SelectItem value="sfax">Sfax</SelectItem>
                          <SelectItem value="sousse">Sousse</SelectItem>
                          <SelectItem value="gabes">Gabès</SelectItem>
                          <SelectItem value="bizerte">Bizerte</SelectItem>
                          <SelectItem value="kairouan">Kairouan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Account & Professional Info */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-lg font-semibold text-white text-center">Finaliser votre compte</h3>

                    <div>
                      <label className="text-sm font-medium text-white/90">Mot de passe</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white/90">Confirmer le mot de passe</label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {formData.userType === "freelancer" && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-white/90">Compétences principales</label>
                          <Input
                            placeholder="React, Node.js, Design..."
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white/90">Expérience</label>
                          <Textarea
                            placeholder="Décrivez brièvement votre expérience..."
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    {formData.userType === "client" && (
                      <div>
                        <label className="text-sm font-medium text-white/90">Entreprise (optionnel)</label>
                        <Input
                          placeholder="Nom de votre entreprise"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                        className="border-white/20 data-[state=checked]:bg-green-600"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-white/80">
                        J'accepte les{" "}
                        <Link href="/terms" className="text-white underline">
                          conditions d'utilisation
                        </Link>
                      </label>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex space-x-4"
                >
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Précédent
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white font-semibold py-3"
                    disabled={isLoading || (step === 1 && !formData.userType)}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : step === 3 ? (
                      "Créer mon compte"
                    ) : (
                      "Suivant"
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <p className="text-white/70">
                  Déjà un compte ?{" "}
                  <Link href="/auth/login" className="text-white font-semibold hover:underline">
                    Se connecter
                  </Link>
                </p>
              </motion.div>

              {/* Success and Error Messages */}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center"
                >
                  {successMsg}
                </motion.div>
              )}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg text-center"
                >
                  {errorMsg}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

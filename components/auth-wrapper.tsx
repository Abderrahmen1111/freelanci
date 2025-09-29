"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, ArrowRight, Crown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface AuthWrapperProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireSubscription?: boolean
  requiredPlan?: "pro" | "enterprise"
  fallbackMessage?: string
}

export default function AuthWrapper({
  children,
  requireAuth = true,
  requireSubscription = false,
  requiredPlan = "pro",
  fallbackMessage,
}: AuthWrapperProps) {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean | null
    user: any
    subscription: any
    canAccess: boolean
    loading: boolean
  }>({
    isAuthenticated: null,
    user: null,
    subscription: null,
    canAccess: false,
    loading: true,
  })

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuthAndSubscription()
  }, [pathname])

  const checkAuthAndSubscription = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token && requireAuth) {
        setAuthState((prev) => ({ ...prev, isAuthenticated: false, loading: false }))
        return
      }

      if (!requireAuth) {
        setAuthState((prev) => ({ ...prev, canAccess: true, loading: false }))
        return
      }

      // Vérifier l'authentification
      const authResponse = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!authResponse.ok) {
        localStorage.removeItem("token")
        setAuthState((prev) => ({ ...prev, isAuthenticated: false, loading: false }))
        return
      }

      const authData = await authResponse.json()
      const user = authData.user

      // Si pas besoin d'abonnement, autoriser l'accès
      if (!requireSubscription) {
        setAuthState({
          isAuthenticated: true,
          user,
          subscription: null,
          canAccess: true,
          loading: false,
        })
        return
      }

      // Vérifier l'abonnement
      const subscriptionResponse = await fetch("/api/subscriptions/current", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!subscriptionResponse.ok) {
        setAuthState({
          isAuthenticated: true,
          user,
          subscription: null,
          canAccess: false,
          loading: false,
        })
        return
      }

      const subscriptionData = await subscriptionResponse.json()
      const subscription = subscriptionData.subscription

      // Vérifier si l'utilisateur a le bon plan
      const hasRequiredPlan =
        requiredPlan === "pro" ? subscription.plan_id !== "free" : subscription.plan_id === "enterprise"

      setAuthState({
        isAuthenticated: true,
        user,
        subscription,
        canAccess: hasRequiredPlan,
        loading: false,
      })
    } catch (error) {
      console.error("Erreur lors de la vérification:", error)
      setAuthState((prev) => ({ ...prev, loading: false, canAccess: false }))
    }
  }

  // Loading state
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Not authenticated
  if (requireAuth && !authState.isAuthenticated) {
    return <AuthRequired />
  }

  // Authenticated but subscription required
  if (requireSubscription && !authState.canAccess) {
    return (
      <SubscriptionRequired
        currentPlan={authState.subscription?.plan_id || "free"}
        requiredPlan={requiredPlan}
        user={authState.user}
        message={fallbackMessage}
      />
    )
  }

  // All checks passed
  return <>{children}</>
}

function AuthRequired() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-blue-900/70 to-green-900/80"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-gradient-to-r from-red-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Lock className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">Connexion Requise</CardTitle>
              <p className="text-white/70">Vous devez être connecté pour accéder à cette fonctionnalité</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Link href="/auth/login">
                  <Button className="w-full bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white font-semibold py-3">
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Créer un compte
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center pt-4"
              >
                <Link href="/" className="text-white/70 hover:text-white text-sm">
                  Retour à l'accueil
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function SubscriptionRequired({
  currentPlan,
  requiredPlan,
  user,
  message,
}: {
  currentPlan: string
  requiredPlan: string
  user: any
  message?: string
}) {
  const planNames = {
    free: "Gratuit",
    pro: "Pro",
    enterprise: "Entreprise",
  }

  const planIcons = {
    pro: Crown,
    enterprise: Star,
  }

  const Icon = planIcons[requiredPlan as keyof typeof planIcons]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-green-900/80"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-lg"
        >
          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Icon className="h-10 w-10 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">
                Abonnement {planNames[requiredPlan as keyof typeof planNames]} Requis
              </CardTitle>
              <p className="text-white/70">
                {message ||
                  `Cette fonctionnalité nécessite un abonnement ${planNames[requiredPlan as keyof typeof planNames]}`}
              </p>

              <div className="flex items-center justify-center space-x-2 mt-4">
                <span className="text-white/60 text-sm">Plan actuel:</span>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {planNames[currentPlan as keyof typeof planNames]}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">
                  🚀 Avec le plan {planNames[requiredPlan as keyof typeof planNames]}, vous obtenez :
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  {requiredPlan === "pro" ? (
                    <>
                      <li>• Projets illimités</li>
                      <li>• Commission réduite à 10%</li>
                      <li>• Badge vérifié</li>
                      <li>• Support prioritaire 24/7</li>
                      <li>• Statistiques avancées</li>
                    </>
                  ) : (
                    <>
                      <li>• Tout du plan Pro</li>
                      <li>• Commission réduite à 5%</li>
                      <li>• Gestion d'équipe</li>
                      <li>• API personnalisée</li>
                      <li>• Manager dédié</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="space-y-3">
                <Link href="/subscription">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3">
                    <Crown className="mr-2 h-4 w-4" />
                    Choisir un Abonnement
                  </Button>
                </Link>

                <Link href={user?.userType === "client" ? "/client-dashboard" : "/freelancer-dashboard"}>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Retour au Dashboard
                  </Button>
                </Link>
              </div>

              <div className="text-center text-sm text-white/60">
                <p>
                  Besoin d'aide ?
                  <Link href="/contact" className="text-white hover:underline ml-1">
                    Contactez notre équipe
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

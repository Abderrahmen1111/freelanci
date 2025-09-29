"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import SubscriptionCard from "@/components/subscription-card"
import { useToast } from "@/hooks/use-toast"

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [plans, setPlans] = useState([])
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Charger les plans et l'abonnement actuel
    Promise.all([
      fetch("/api/subscriptions/plans").then((res) => res.json()),
      fetch("/api/subscriptions/current", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json()),
    ])
      .then(([plansData, subscriptionData]) => {
        if (plansData.success) setPlans(plansData.plans)
        if (subscriptionData.success) setCurrentSubscription(subscriptionData.subscription)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const handleSubscribe = async (planId: string, billingPeriod: "monthly" | "yearly") => {
    try {
      const response = await fetch("/api/subscriptions/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ planId, billingPeriod }),
      })

      const data = await response.json()

      if (data.success) {
        // Rediriger vers Stripe Checkout
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-green-900/90"></div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
            }}
            animate={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <motion.h1
                className="text-4xl lg:text-6xl font-bold text-white"
                animate={{
                  backgroundImage: [
                    "linear-gradient(45deg, #ffffff, #fbbf24, #ffffff)",
                    "linear-gradient(45deg, #fbbf24, #22c55e, #fbbf24)",
                    "linear-gradient(45deg, #22c55e, #ffffff, #22c55e)",
                    "linear-gradient(45deg, #ffffff, #fbbf24, #ffffff)",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                style={{
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Choisissez votre{" "}
                <span className="bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent">
                  Abonnement
                </span>
              </motion.h1>
              <motion.p
                className="text-xl text-white/80 max-w-2xl mx-auto"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                Débloquez tout le potentiel de Freelancii.tn avec nos plans premium
              </motion.p>
            </motion.div>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center space-x-4 mt-8"
            >
              <span className={`text-sm ${!isYearly ? "text-white" : "text-white/60"}`}>Mensuel</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-green-600" />
              <span className={`text-sm ${isYearly ? "text-white" : "text-white/60"}`}>
                Annuel
                <Badge className="ml-2 bg-green-600 text-white">-17%</Badge>
              </span>
            </motion.div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                currentPlan={currentSubscription?.plan_id}
                isYearly={isYearly}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Méthodes de paiement acceptées</h3>
            <div className="flex justify-center items-center space-x-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
                <div className="w-16 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">QR CODE</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
                <div className="w-16 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">CARTE</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
                <div className="w-16 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MOBILE</span>
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm mt-4">Paiement sécurisé • Annulation à tout moment • Support 24/7</p>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-8">Questions fréquentes</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "Puis-je changer de plan à tout moment ?",
                  a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre tableau de bord.",
                },
                {
                  q: "Y a-t-il une période d'essai gratuite ?",
                  a: "Le plan gratuit vous permet de tester nos fonctionnalités de base. Pas besoin d'essai pour les plans payants.",
                },
                {
                  q: "Comment fonctionne la commission ?",
                  a: "Nous prélevons un pourcentage sur chaque transaction réussie selon votre plan d'abonnement.",
                },
                {
                  q: "Le support est-il inclus ?",
                  a: "Tous les plans incluent un support. Les plans payants bénéficient d'un support prioritaire 24/7.",
                },
              ].map((faq, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-md border-white/10">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                    <p className="text-white/70 text-sm">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Star, Crown, Zap, CreditCard, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  features: string[]
  popular?: boolean
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan
  currentPlan?: string
  isYearly: boolean
  onSubscribe: (planId: string, billingPeriod: "monthly" | "yearly") => Promise<void>
}

const planIcons = {
  free: Star,
  pro: Crown,
  enterprise: Zap,
}

const planColors = {
  free: "from-gray-500 to-gray-600",
  pro: "from-blue-500 to-purple-600",
  enterprise: "from-green-500 to-emerald-600",
}

export default function SubscriptionCard({ plan, currentPlan, isYearly, onSubscribe }: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const Icon = planIcons[plan.id as keyof typeof planIcons] || Star
  const colorClass = planColors[plan.id as keyof typeof planColors] || planColors.free

  const handleSubscribe = async () => {
    if (plan.id === "free" || plan.id === currentPlan) return

    setIsLoading(true)
    try {
      await onSubscribe(plan.id, isYearly ? "yearly" : "monthly")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'abonnement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const displayPrice = isYearly && plan.price > 0 ? Math.round(plan.price * 12 * 0.83) : plan.price

  const isCurrentPlan = plan.id === currentPlan

  return (
    <motion.div whileHover={{ y: -10, scale: 1.02 }} className="relative">
      {plan.popular && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <Badge className="bg-gradient-to-r from-red-500 to-green-500 text-white px-4 py-1">Le plus populaire</Badge>
        </motion.div>
      )}

      <motion.div
        whileHover={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          background: "rgba(255, 255, 255, 0.15)",
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card
          className={`h-full backdrop-blur-md bg-white/10 border-white/20 shadow-2xl ${
            plan.popular ? "ring-2 ring-green-500/50" : ""
          } ${isCurrentPlan ? "ring-2 ring-blue-500/50" : ""}`}
        >
          <CardHeader className="text-center pb-8">
            <div
              className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-2xl flex items-center justify-center mx-auto mb-4`}
            >
              <Icon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>

            {isCurrentPlan && (
              <Badge variant="secondary" className="mx-auto">
                Plan actuel
              </Badge>
            )}

            <div className="mt-4">
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-white">{displayPrice}</span>
                <span className="text-white/70 ml-2">DT/{isYearly ? "an" : "mois"}</span>
              </div>
              {isYearly && plan.price > 0 && (
                <p className="text-sm text-green-400 mt-1">Économisez {plan.price * 12 - displayPrice} DT par an</p>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              {plan.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center space-x-3"
                >
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={handleSubscribe}
              disabled={isLoading || plan.id === "free" || isCurrentPlan}
              className={`w-full py-3 font-semibold ${
                plan.id === "free" || isCurrentPlan
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  : plan.popular
                    ? "bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : plan.id === "free" ? (
                "Plan gratuit"
              ) : isCurrentPlan ? (
                "Plan actuel"
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Choisir ce plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

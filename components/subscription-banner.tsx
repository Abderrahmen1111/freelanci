"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface SubscriptionBannerProps {
  userId?: string
  showOnFree?: boolean
}

export default function SubscriptionBanner({ userId, showOnFree = true }: SubscriptionBannerProps) {
  const [subscription, setSubscription] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (!userId) return

    // Vérifier si la bannière a été fermée récemment
    const dismissedUntil = localStorage.getItem("subscription-banner-dismissed")
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
      return
    }

    fetchSubscriptionData()
  }, [userId])

  const fetchSubscriptionData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/subscriptions/current", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)

        // Afficher la bannière si plan gratuit ou limite atteinte
        const shouldShow =
          showOnFree &&
          (data.subscription.plan_id === "free" ||
            data.subscription.usage?.isLimitReached ||
            data.subscription.cancel_at_period_end)

        setIsVisible(shouldShow)
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'abonnement:", error)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    // Cacher la bannière pour 24h
    const dismissUntil = new Date()
    dismissUntil.setHours(dismissUntil.getHours() + 24)
    localStorage.setItem("subscription-banner-dismissed", dismissUntil.toISOString())
  }

  if (!isVisible || isDismissed || !subscription) return null

  const getBannerContent = () => {
    if (subscription.cancel_at_period_end) {
      return {
        type: "warning",
        title: "Abonnement en cours d'annulation",
        message: `Votre abonnement sera annulé le ${new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}`,
        action: "Réactiver",
        href: "/subscription",
        color: "from-orange-500 to-red-500",
      }
    }

    if (subscription.usage?.isProjectLimitReached) {
      return {
        type: "limit",
        title: "Limite de projets atteinte",
        message: `Vous avez utilisé ${subscription.usage.projectsThisMonth}/${subscription.usage.projectsLimit} projets ce mois`,
        action: "Passer au Pro",
        href: "/subscription",
        color: "from-red-500 to-pink-500",
      }
    }

    if (subscription.plan_id === "free") {
      const usagePercent = subscription.usage
        ? (subscription.usage.projectsThisMonth / subscription.usage.projectsLimit) * 100
        : 0

      return {
        type: "upgrade",
        title: "Débloquez tout le potentiel de FreelanceTN",
        message: "Projets illimités, commission réduite, badge vérifié et plus encore",
        action: "Découvrir Pro",
        href: "/subscription",
        color: "from-blue-500 to-purple-500",
        showProgress: true,
        progress: usagePercent,
      }
    }

    return null
  }

  const content = getBannerContent()
  if (!content) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className={`bg-gradient-to-r ${content.color} text-white shadow-lg`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <Crown className="h-6 w-6 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm md:text-base truncate">{content.title}</h3>
                  <p className="text-white/90 text-xs md:text-sm truncate">{content.message}</p>
                  {content.showProgress && subscription.usage && (
                    <div className="mt-2 max-w-xs">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Projets utilisés</span>
                        <span>
                          {subscription.usage.projectsThisMonth}/{subscription.usage.projectsLimit}
                        </span>
                      </div>
                      <Progress value={content.progress} className="h-2 bg-white/20" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <Link href={content.href}>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    {content.action}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>

                <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-white hover:bg-white/20 p-1">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

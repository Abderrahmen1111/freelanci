"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ProjectCreationGuardProps {
  children: React.ReactNode
  onCanCreate?: (canCreate: boolean) => void
}

export default function ProjectCreationGuard({ children, onCanCreate }: ProjectCreationGuardProps) {
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkProjectLimits()
  }, [])

  const checkProjectLimits = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/subscriptions/current", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data.subscription)

        const canCreate = data.subscription.usage?.isProjectLimitReached !== true
        onCanCreate?.(canCreate)
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des limites:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Si l'utilisateur peut créer des projets, afficher le contenu normal
  if (!subscriptionData?.usage?.isProjectLimitReached) {
    return <>{children}</>
  }

  // Afficher l'écran de limite atteinte
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl text-orange-800">Limite de projets atteinte</CardTitle>
          <p className="text-orange-700">Vous avez utilisé tous vos projets pour ce mois</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Projets utilisés</span>
              <span className="font-medium">
                {subscriptionData.usage.projectsThisMonth}/{subscriptionData.usage.projectsLimit}
              </span>
            </div>
            <Progress value={100} className="h-3" />
          </div>

          {/* Plan actuel */}
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Plan actuel</h3>
                <p className="text-gray-600 text-sm">{subscriptionData.usage.projectsLimit} projets par mois</p>
              </div>
              <Badge variant="secondary">{subscriptionData.plan_id === "free" ? "Gratuit" : "Pro"}</Badge>
            </div>
          </div>

          {/* Avantages du plan Pro */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Passez au plan Pro</h3>
            </div>

            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Projets illimités</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Commission réduite à 10%</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Badge vérifié</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Support prioritaire 24/7</span>
              </li>
            </ul>

            <div className="flex space-x-3">
              <Link href="/subscription" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Crown className="mr-2 h-4 w-4" />
                  Passer au Pro
                </Button>
              </Link>

              <Button variant="outline" onClick={() => window.location.reload()} className="px-6">
                Actualiser
              </Button>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Vos limites se réinitialisent le 1er de chaque mois.
              <br />
              Prochaine réinitialisation :{" "}
              {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

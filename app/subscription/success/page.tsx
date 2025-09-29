"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SubscriptionSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (sessionId) {
      // Vérifier le statut de la session
      fetch(`/api/subscriptions/verify-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSubscriptionData(data.subscription)
          }
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-12 w-12 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Abonnement Activé !</CardTitle>
            <p className="text-white/90 text-lg">Félicitations ! Votre abonnement a été activé avec succès.</p>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {subscriptionData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Détails de votre abonnement</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Plan</p>
                    <p className="font-semibold text-lg">{subscriptionData.plan_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prix</p>
                    <p className="font-semibold text-lg">{subscriptionData.amount} TND</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Période</p>
                    <p className="font-semibold">{subscriptionData.billing_period}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prochaine facturation</p>
                    <p className="font-semibold">
                      {new Date(subscriptionData.next_billing_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-3">🎉 Vous avez maintenant accès à :</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Projets illimités</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Support prioritaire 24/7</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Badge vérifié</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Commission réduite</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Statistiques avancées</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/client-dashboard" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 group">
                  Accéder au Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {subscriptionData?.invoice_url && (
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <a href={subscriptionData.invoice_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger la facture
                  </a>
                </Button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-sm text-gray-600"
            >
              <p>
                Un email de confirmation a été envoyé à votre adresse.
                <br />
                Vous pouvez gérer votre abonnement depuis votre profil.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

"use client"

import type { ReactNode } from "react"
import { Crown, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface FeatureGateProps {
  children: ReactNode
  requiredPlan: "pro" | "enterprise"
  currentPlan: string
  featureName: string
  description?: string
  showPreview?: boolean
}

export default function FeatureGate({
  children,
  requiredPlan,
  currentPlan,
  featureName,
  description,
  showPreview = false,
}: FeatureGateProps) {
  const hasAccess = requiredPlan === "pro" ? currentPlan !== "free" : currentPlan === "enterprise"

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Contenu flouté en arrière-plan si preview activé */}
      {showPreview && <div className="blur-sm pointer-events-none opacity-50">{children}</div>}

      {/* Overlay de verrouillage */}
      <Card className={`${showPreview ? "absolute inset-0 bg-white/95" : ""} border-2 border-dashed border-gray-300`}>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">{featureName}</h3>
            <p className="text-gray-600 max-w-md">
              {description || `Cette fonctionnalité nécessite un abonnement ${requiredPlan.toUpperCase()}`}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Plan requis:</span>
            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-medium">
              {requiredPlan.toUpperCase()}
            </span>
          </div>

          <Link href="/subscription">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Crown className="mr-2 h-4 w-4" />
              Débloquer cette fonctionnalité
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

import { NextResponse } from "next/server"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      plans: Object.values(SUBSCRIPTION_PLANS),
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des plans:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { stripe } from "@/lib/stripe"
import { pool } from "@/lib/db"

export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    // Récupérer l'abonnement de l'utilisateur
    const result = await pool.query("SELECT stripe_subscription_id FROM subscriptions WHERE user_id = $1", [user.id])

    if (result.rows.length === 0 || !result.rows[0].stripe_subscription_id) {
      return NextResponse.json({ error: "Aucun abonnement actif trouvé" }, { status: 404 })
    }

    const subscriptionId = result.rows[0].stripe_subscription_id

    // Annuler l'abonnement à la fin de la période
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    // Mettre à jour la base de données
    await pool.query("UPDATE subscriptions SET cancel_at_period_end = true WHERE user_id = $1", [user.id])

    return NextResponse.json({
      success: true,
      message: "Abonnement programmé pour annulation à la fin de la période",
    })
  } catch (error) {
    console.error("Erreur lors de l'annulation:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})

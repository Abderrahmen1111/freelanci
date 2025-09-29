import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { pool } from "@/lib/db"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe"

export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    const result = await pool.query(
      `
      SELECT s.*, 
             COUNT(p.id) as projects_this_month
      FROM subscriptions s
      LEFT JOIN projects p ON p.client_id = $1 
        AND p.created_at >= date_trunc('month', CURRENT_DATE)
      WHERE s.user_id = $1
      GROUP BY s.id
    `,
      [user.id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Abonnement non trouvé" }, { status: 404 })
    }

    const subscription = result.rows[0]
    const plan = SUBSCRIPTION_PLANS[subscription.plan_id as keyof typeof SUBSCRIPTION_PLANS]

    // Calculer l'utilisation
    const usage = {
      projectsThisMonth: Number.parseInt(subscription.projects_this_month),
      projectsLimit: plan.limits.projectsPerMonth,
      isLimitReached:
        plan.limits.projectsPerMonth !== -1 &&
        Number.parseInt(subscription.projects_this_month) >= plan.limits.projectsPerMonth,
    }

    return NextResponse.json({
      success: true,
      subscription: {
        ...subscription,
        plan: plan,
        usage: usage,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'abonnement:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})

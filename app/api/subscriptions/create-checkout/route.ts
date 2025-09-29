import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { stripe, SUBSCRIPTION_PLANS } from "@/lib/stripe"
import { pool } from "@/lib/db"
import { z } from "zod"

const createCheckoutSchema = z.object({
  planId: z.enum(["pro", "enterprise"]),
  billingPeriod: z.enum(["monthly", "yearly"]).default("monthly"),
})

export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json()
    const { planId, billingPeriod } = createCheckoutSchema.parse(body)

    const plan = SUBSCRIPTION_PLANS[planId]
    if (!plan || !plan.priceId) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 })
    }

    // Vérifier si l'utilisateur a déjà un customer Stripe
    let customerId: string
    const customerResult = await pool.query("SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1", [
      user.id,
    ])

    if (customerResult.rows[0]?.stripe_customer_id) {
      customerId = customerResult.rows[0].stripe_customer_id
    } else {
      // Créer un nouveau customer Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Mettre à jour la base de données
      await pool.query("UPDATE subscriptions SET stripe_customer_id = $1 WHERE user_id = $2", [customerId, user.id])
    }

    // Calculer le prix selon la période
    const priceAmount =
      billingPeriod === "yearly"
        ? Math.round(plan.price * 12 * 0.83) // 17% de réduction annuelle
        : plan.price

    // Créer la session de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "tnd",
            product_data: {
              name: `Plan ${plan.name}`,
              description: `Abonnement ${billingPeriod === "yearly" ? "annuel" : "mensuel"} FreelanceTN`,
            },
            unit_amount: priceAmount * 100, // Stripe utilise les centimes
            recurring: {
              interval: billingPeriod === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscription?canceled=true`,
      metadata: {
        userId: user.id,
        planId: planId,
        billingPeriod: billingPeriod,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: planId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Données invalides", details: error.errors }, { status: 400 })
    }

    console.error("Erreur lors de la création du checkout:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})

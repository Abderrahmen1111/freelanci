import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { pool } from "@/lib/db"
import { createNotification } from "@/app/api/notifications/route"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")!

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Gérer les différents types d'événements
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object)
        break

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object)
        break

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object)
        break

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: any) {
  const userId = session.metadata.userId
  const planId = session.metadata.planId

  if (!userId || !planId) {
    console.error("Missing metadata in checkout session")
    return
  }

  // Récupérer l'abonnement Stripe
  const subscription = await stripe.subscriptions.retrieve(session.subscription)

  // Mettre à jour l'abonnement dans la base de données
  await pool.query(
    `
    UPDATE subscriptions 
    SET 
      plan_id = $1,
      stripe_subscription_id = $2,
      status = $3,
      current_period_start = $4,
      current_period_end = $5
    WHERE user_id = $6
  `,
    [
      planId,
      subscription.id,
      subscription.status,
      new Date(subscription.current_period_start * 1000),
      new Date(subscription.current_period_end * 1000),
      userId,
    ],
  )

  // Mettre à jour le plan dans la table users
  await pool.query("UPDATE users SET subscription_plan = $1, subscription_expires_at = $2 WHERE id = $3", [
    planId,
    new Date(subscription.current_period_end * 1000),
    userId,
  ])

  // Créer une notification
  await createNotification(
    userId,
    "Abonnement activé",
    `Votre abonnement ${planId.toUpperCase()} a été activé avec succès !`,
    "subscription",
  )
}

async function handleSubscriptionCreated(subscription: any) {
  const userId = subscription.metadata.userId
  const planId = subscription.metadata.planId

  if (!userId) return

  await pool.query(
    `
    UPDATE subscriptions 
    SET 
      stripe_subscription_id = $1,
      status = $2,
      current_period_start = $3,
      current_period_end = $4
    WHERE user_id = $5
  `,
    [
      subscription.id,
      subscription.status,
      new Date(subscription.current_period_start * 1000),
      new Date(subscription.current_period_end * 1000),
      userId,
    ],
  )
}

async function handleSubscriptionUpdated(subscription: any) {
  await pool.query(
    `
    UPDATE subscriptions 
    SET 
      status = $1,
      current_period_start = $2,
      current_period_end = $3,
      cancel_at_period_end = $4
    WHERE stripe_subscription_id = $5
  `,
    [
      subscription.status,
      new Date(subscription.current_period_start * 1000),
      new Date(subscription.current_period_end * 1000),
      subscription.cancel_at_period_end,
      subscription.id,
    ],
  )

  // Mettre à jour la table users
  const userId = subscription.metadata.userId
  if (userId) {
    await pool.query("UPDATE users SET subscription_expires_at = $1 WHERE id = $2", [
      new Date(subscription.current_period_end * 1000),
      userId,
    ])
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  const userId = subscription.metadata.userId

  // Remettre l'utilisateur au plan gratuit
  await pool.query(
    `
    UPDATE subscriptions 
    SET 
      plan_id = 'free',
      status = 'canceled',
      stripe_subscription_id = NULL
    WHERE stripe_subscription_id = $1
  `,
    [subscription.id],
  )

  if (userId) {
    await pool.query("UPDATE users SET subscription_plan = $1, subscription_expires_at = NULL WHERE id = $2", [
      "free",
      userId,
    ])

    await createNotification(
      userId,
      "Abonnement annulé",
      "Votre abonnement a été annulé. Vous êtes maintenant sur le plan gratuit.",
      "subscription",
    )
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  const customerId = invoice.customer

  // Récupérer l'utilisateur
  const userResult = await pool.query("SELECT user_id FROM subscriptions WHERE stripe_customer_id = $1", [customerId])

  if (userResult.rows.length === 0) return

  const userId = userResult.rows[0].user_id

  // Enregistrer la facture
  await pool.query(
    `
    INSERT INTO invoices (user_id, stripe_invoice_id, amount, status, invoice_url, pdf_url)
    VALUES ($1, $2, $3, 'paid', $4, $5)
    ON CONFLICT (stripe_invoice_id) DO UPDATE SET
      status = 'paid',
      invoice_url = $4,
      pdf_url = $5
  `,
    [
      userId,
      invoice.id,
      invoice.amount_paid / 100, // Convertir de centimes
      invoice.hosted_invoice_url,
      invoice.invoice_pdf,
    ],
  )

  await createNotification(
    userId,
    "Paiement confirmé",
    `Votre paiement de ${invoice.amount_paid / 100} TND a été confirmé.`,
    "payment",
  )
}

async function handleInvoicePaymentFailed(invoice: any) {
  const customerId = invoice.customer

  const userResult = await pool.query("SELECT user_id FROM subscriptions WHERE stripe_customer_id = $1", [customerId])

  if (userResult.rows.length === 0) return

  const userId = userResult.rows[0].user_id

  await createNotification(
    userId,
    "Échec du paiement",
    "Le paiement de votre abonnement a échoué. Veuillez mettre à jour votre méthode de paiement.",
    "payment_failed",
  )
}

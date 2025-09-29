import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

// Configuration des plans d'abonnement
export const SUBSCRIPTION_PLANS = {
  free: {
    id: "free",
    name: "Gratuit",
    price: 0,
    priceId: null,
    features: ["3 projets par mois", "Support par email", "Profil de base", "Commission 15%"],
    limits: {
      projectsPerMonth: 3,
      commission: 0.15,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 10,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Projets illimités",
      "Support prioritaire 24/7",
      "Badge vérifié",
      "Commission réduite 10%",
      "Statistiques avancées",
      "Profil premium",
      "Boost de visibilité",
    ],
    limits: {
      projectsPerMonth: -1, // illimité
      commission: 0.1,
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Entreprise",
    price: 25,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      "Tout du plan Pro",
      "Gestion d'équipe",
      "API personnalisée",
      "Commission 5%",
      "Manager dédié",
      "Formation personnalisée",
      "Intégrations avancées",
    ],
    limits: {
      projectsPerMonth: -1,
      commission: 0.05,
    },
  },
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS

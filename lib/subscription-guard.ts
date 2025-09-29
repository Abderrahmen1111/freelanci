import { pool } from "./db"
import { SUBSCRIPTION_PLANS } from "./stripe"

export interface SubscriptionLimits {
  projectsPerMonth: number
  commission: number
  canAccessPremiumFeatures: boolean
  canCreateUnlimitedProjects: boolean
  hasVerifiedBadge: boolean
  hasPrioritySupport: boolean
}

export async function checkSubscriptionLimits(userId: string): Promise<{
  subscription: any
  limits: SubscriptionLimits
  usage: any
  canPerformAction: (action: string) => boolean
}> {
  // Récupérer l'abonnement actuel
  const subscriptionResult = await pool.query(
    `
    SELECT s.*, 
           COUNT(p.id) as projects_this_month
    FROM subscriptions s
    LEFT JOIN projects p ON p.client_id = $1 
      AND p.created_at >= date_trunc('month', CURRENT_DATE)
    WHERE s.user_id = $1
    GROUP BY s.id
  `,
    [userId],
  )

  if (subscriptionResult.rows.length === 0) {
    throw new Error("Aucun abonnement trouvé")
  }

  const subscription = subscriptionResult.rows[0]
  const plan = SUBSCRIPTION_PLANS[subscription.plan_id as keyof typeof SUBSCRIPTION_PLANS]

  // Vérifier si l'abonnement est actif
  const isActive =
    subscription.status === "active" &&
    (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date())

  // Si l'abonnement payant a expiré, revenir au plan gratuit
  if (!isActive && subscription.plan_id !== "free") {
    await pool.query("UPDATE subscriptions SET plan_id = 'free', status = 'canceled' WHERE user_id = $1", [userId])
    await pool.query("UPDATE users SET subscription_plan = 'free', subscription_expires_at = NULL WHERE id = $1", [
      userId,
    ])
    subscription.plan_id = "free"
  }

  const currentPlan = SUBSCRIPTION_PLANS[subscription.plan_id as keyof typeof SUBSCRIPTION_PLANS]
  const projectsThisMonth = Number.parseInt(subscription.projects_this_month) || 0

  const limits: SubscriptionLimits = {
    projectsPerMonth: currentPlan.limits.projectsPerMonth,
    commission: currentPlan.limits.commission,
    canAccessPremiumFeatures: subscription.plan_id !== "free",
    canCreateUnlimitedProjects: currentPlan.limits.projectsPerMonth === -1,
    hasVerifiedBadge: subscription.plan_id !== "free",
    hasPrioritySupport: subscription.plan_id !== "free",
  }

  const usage = {
    projectsThisMonth,
    projectsLimit: limits.projectsPerMonth,
    isProjectLimitReached: limits.projectsPerMonth !== -1 && projectsThisMonth >= limits.projectsPerMonth,
  }

  const canPerformAction = (action: string): boolean => {
    switch (action) {
      case "create_project":
        return limits.canCreateUnlimitedProjects || !usage.isProjectLimitReached
      case "access_premium_features":
        return limits.canAccessPremiumFeatures
      case "priority_support":
        return limits.hasPrioritySupport
      case "verified_badge":
        return limits.hasVerifiedBadge
      default:
        return true
    }
  }

  return {
    subscription,
    limits,
    usage,
    canPerformAction,
  }
}

export async function requireSubscription(userId: string, requiredPlan: "pro" | "enterprise" = "pro") {
  const { subscription, canPerformAction } = await checkSubscriptionLimits(userId)

  if (subscription.plan_id === "free") {
    throw new Error("SUBSCRIPTION_REQUIRED")
  }

  if (requiredPlan === "enterprise" && subscription.plan_id !== "enterprise") {
    throw new Error("ENTERPRISE_REQUIRED")
  }

  return true
}

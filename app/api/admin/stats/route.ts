import { type NextRequest, NextResponse } from "next/server"
import { withAdminAuth } from "@/lib/middleware"
import { pool } from "@/lib/db"

export const GET = withAdminAuth(async (req: NextRequest, user: any) => {
  try {
    // Statistiques générales
    const statsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE user_type != 'admin') as total_users,
        (SELECT COUNT(*) FROM users WHERE user_type = 'client') as total_clients,
        (SELECT COUNT(*) FROM users WHERE user_type = 'freelancer') as total_freelancers,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'in_progress') as active_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'completed') as completed_projects,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed') as total_revenue,
        (SELECT COALESCE(SUM(commission), 0) FROM payments WHERE status = 'completed') as total_commission,
        (SELECT COUNT(*) FROM reports WHERE status = 'pending') as pending_reports
    `)

    // Statistiques mensuelles
    const monthlyStatsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE created_at >= date_trunc('month', CURRENT_DATE)) as new_users_this_month,
        (SELECT COUNT(*) FROM projects WHERE created_at >= date_trunc('month', CURRENT_DATE)) as new_projects_this_month,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE created_at >= date_trunc('month', CURRENT_DATE) AND status = 'completed') as revenue_this_month
    `)

    // Évolution des inscriptions (7 derniers jours)
    const userGrowthResult = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `)

    // Top freelancers par revenus
    const topFreelancersResult = await pool.query(`
      SELECT 
        u.first_name,
        u.last_name,
        u.email,
        COALESCE(SUM(p.amount - p.commission), 0) as total_earnings,
        COUNT(p.id) as completed_payments
      FROM users u
      LEFT JOIN payments p ON u.id = p.receiver_id AND p.status = 'completed'
      WHERE u.user_type = 'freelancer'
      GROUP BY u.id, u.first_name, u.last_name, u.email
      ORDER BY total_earnings DESC
      LIMIT 10
    `)

    return NextResponse.json({
      success: true,
      stats: {
        general: statsResult.rows[0],
        monthly: monthlyStatsResult.rows[0],
        userGrowth: userGrowthResult.rows,
        topFreelancers: topFreelancersResult.rows,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
})

import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { pool } from "@/lib/db"

// GET - Récupérer les notifications de l'utilisateur
export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get("unread") === "true"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let query = "SELECT * FROM notifications WHERE user_id = $1"
    const params = [user.id]

    if (unreadOnly) {
      query += " AND is_read = false"
    }

    query += " ORDER BY created_at DESC LIMIT $2 OFFSET $3"
    params.push(limit, offset)

    const result = await pool.query(query, params)

    // Compter les notifications non lues
    const unreadCountResult = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false",
      [user.id],
    )

    return NextResponse.json({
      success: true,
      notifications: result.rows,
      unreadCount: Number.parseInt(unreadCountResult.rows[0].count),
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
})

// POST - Créer une nouvelle notification
export async function createNotification(userId: string, title: string, message: string, type: string) {
  try {
    await pool.query("INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)", [
      userId,
      title,
      message,
      type,
    ])
  } catch (error) {
    console.error("Erreur lors de la création de la notification:", error)
  }
}

// PUT - Marquer les notifications comme lues
export const PUT = withAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json()
    const { notificationIds, markAllAsRead } = body

    if (markAllAsRead) {
      await pool.query("UPDATE notifications SET is_read = true WHERE user_id = $1", [user.id])
    } else if (notificationIds && Array.isArray(notificationIds)) {
      await pool.query("UPDATE notifications SET is_read = true WHERE id = ANY($1) AND user_id = $2", [
        notificationIds,
        user.id,
      ])
    }

    return NextResponse.json({
      success: true,
      message: "Notifications mises à jour",
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
})

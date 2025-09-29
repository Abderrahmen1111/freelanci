import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { pool } from "@/lib/db"

export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const result = await pool.query(
      `
      SELECT * FROM invoices 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `,
      [user.id, limit, offset],
    )

    const countResult = await pool.query("SELECT COUNT(*) FROM invoices WHERE user_id = $1", [user.id])

    const total = Number.parseInt(countResult.rows[0].count)

    return NextResponse.json({
      success: true,
      invoices: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des factures:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})

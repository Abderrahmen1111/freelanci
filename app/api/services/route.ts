import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { pool } from "@/lib/db"
import { z } from "zod"

const createServiceSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
  priceFrom: z.number().min(1, "Le prix doit être supérieur à 0"),
  category: z.string().min(2, "La catégorie est requise"),
})

// GET - Récupérer tous les services
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const freelancerId = searchParams.get("freelancerId")
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let query = `
      SELECT s.*, 
             u.first_name, u.last_name, u.avatar_url, u.is_verified,
             AVG(r.rating) as avg_rating,
             COUNT(r.id) as review_count
      FROM services s
      LEFT JOIN users u ON s.freelancer_id = u.id
      LEFT JOIN reviews r ON r.reviewed_id = s.freelancer_id
      WHERE s.is_active = true
    `
    const params: any[] = []
    let paramIndex = 1

    if (freelancerId) {
      query += ` AND s.freelancer_id = $${paramIndex}`
      params.push(freelancerId)
      paramIndex++
    }

    if (category) {
      query += ` AND s.category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    query += ` GROUP BY s.id, u.first_name, u.last_name, u.avatar_url, u.is_verified`
    query += ` ORDER BY s.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await pool.query(query, params)

    return NextResponse.json({
      success: true,
      services: result.rows,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
}

// POST - Créer un nouveau service
export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    if (user.userType !== "freelancer") {
      return NextResponse.json(
        {
          error: "Seuls les freelancers peuvent créer des services",
        },
        { status: 403 },
      )
    }

    const body = await req.json()
    const validatedData = createServiceSchema.parse(body)

    const result = await pool.query(
      `INSERT INTO services (freelancer_id, title, description, price_from, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user.id, validatedData.title, validatedData.description, validatedData.priceFrom, validatedData.category],
    )

    return NextResponse.json(
      {
        success: true,
        service: result.rows[0],
      },
      { status: 201 },
    )
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("Erreur lors de la création du service:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
})

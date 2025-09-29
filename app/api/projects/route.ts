import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { pool } from "@/lib/db"
import { checkSubscriptionLimits } from "@/lib/subscription-guard"
import { z } from "zod"

const createProjectSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
  budget: z.number().min(1, "Le budget doit être supérieur à 0"),
  deadline: z.string().optional(),
  skillsRequired: z.array(z.string()).min(1, "Au moins une compétence est requise"),
})

// GET - Récupérer tous les projets (CONNEXION REQUISE)
export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const clientId = searchParams.get("clientId")
    const freelancerId = searchParams.get("freelancerId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let query = `
      SELECT p.*, 
             c.first_name as client_first_name, c.last_name as client_last_name,
             f.first_name as freelancer_first_name, f.last_name as freelancer_last_name
      FROM projects p
      LEFT JOIN users c ON p.client_id = c.id
      LEFT JOIN users f ON p.freelancer_id = f.id
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    // Filtrer selon le type d'utilisateur
    if (user.userType === "client") {
      query += ` AND p.client_id = $${paramIndex}`
      params.push(user.id)
      paramIndex++
    } else if (user.userType === "freelancer") {
      query += ` AND (p.freelancer_id = $${paramIndex} OR p.status = 'published')`
      params.push(user.id)
      paramIndex++
    }

    if (status) {
      query += ` AND p.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (clientId) {
      query += ` AND p.client_id = $${paramIndex}`
      params.push(clientId)
      paramIndex++
    }

    if (freelancerId) {
      query += ` AND p.freelancer_id = $${paramIndex}`
      params.push(freelancerId)
      paramIndex++
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await pool.query(query, params)

    return NextResponse.json({
      success: true,
      projects: result.rows,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})

// POST - Créer un nouveau projet (CONNEXION + VÉRIFICATION LIMITES)
export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    if (user.userType !== "client") {
      return NextResponse.json({ error: "Seuls les clients peuvent créer des projets" }, { status: 403 })
    }

    // Vérifier les limites d'abonnement
    const { canPerformAction, usage, limits } = await checkSubscriptionLimits(user.id)

    if (!canPerformAction("create_project")) {
      return NextResponse.json(
        {
          error: "SUBSCRIPTION_LIMIT_REACHED",
          message: `Vous avez atteint la limite de ${limits.projectsPerMonth} projets par mois. Passez au plan Pro pour des projets illimités.`,
          usage,
          limits,
        },
        { status: 402 },
      ) // 402 Payment Required
    }

    const body = await req.json()
    const validatedData = createProjectSchema.parse(body)

    const result = await pool.query(
      `INSERT INTO projects (title, description, client_id, budget, deadline, skills_required, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'published')
       RETURNING *`,
      [
        validatedData.title,
        validatedData.description,
        user.id,
        validatedData.budget,
        validatedData.deadline ? new Date(validatedData.deadline) : null,
        validatedData.skillsRequired,
      ],
    )

    return NextResponse.json(
      {
        success: true,
        project: result.rows[0],
        message: "Projet créé avec succès",
      },
      { status: 201 },
    )
  } catch (error: any) {
    if (error.message === "SUBSCRIPTION_REQUIRED") {
      return NextResponse.json(
        {
          error: "SUBSCRIPTION_REQUIRED",
          message: "Un abonnement payant est requis pour cette fonctionnalité",
        },
        { status: 402 },
      )
    }

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("Erreur lors de la création du projet:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})

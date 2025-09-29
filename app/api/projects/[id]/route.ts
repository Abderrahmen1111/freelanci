import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { pool } from "@/lib/db"

// GET - Récupérer un projet spécifique
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query(
      `SELECT p.*, 
              c.first_name as client_first_name, c.last_name as client_last_name, c.email as client_email,
              f.first_name as freelancer_first_name, f.last_name as freelancer_last_name, f.email as freelancer_email
       FROM projects p
       LEFT JOIN users c ON p.client_id = c.id
       LEFT JOIN users f ON p.freelancer_id = f.id
       WHERE p.id = $1`,
      [params.id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Projet non trouvé",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      project: result.rows[0],
    })
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
}

// PUT - Mettre à jour un projet
export const PUT = withAuth(async (req: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    const body = await req.json()

    // Vérifier que l'utilisateur est le propriétaire du projet ou un admin
    const projectResult = await pool.query("SELECT client_id, freelancer_id FROM projects WHERE id = $1", [params.id])

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Projet non trouvé",
        },
        { status: 404 },
      )
    }

    const project = projectResult.rows[0]
    const isOwner = project.client_id === user.id || project.freelancer_id === user.id
    const isAdmin = user.userType === "admin"

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          error: "Accès refusé",
        },
        { status: 403 },
      )
    }

    // Construire la requête de mise à jour dynamiquement
    const updateFields = []
    const values = []
    let paramIndex = 1

    if (body.title) {
      updateFields.push(`title = $${paramIndex}`)
      values.push(body.title)
      paramIndex++
    }

    if (body.description) {
      updateFields.push(`description = $${paramIndex}`)
      values.push(body.description)
      paramIndex++
    }

    if (body.budget) {
      updateFields.push(`budget = $${paramIndex}`)
      values.push(body.budget)
      paramIndex++
    }

    if (body.status) {
      updateFields.push(`status = $${paramIndex}`)
      values.push(body.status)
      paramIndex++
    }

    if (body.progress !== undefined) {
      updateFields.push(`progress = $${paramIndex}`)
      values.push(body.progress)
      paramIndex++
    }

    if (body.freelancerId) {
      updateFields.push(`freelancer_id = $${paramIndex}`)
      values.push(body.freelancerId)
      paramIndex++
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        {
          error: "Aucune donnée à mettre à jour",
        },
        { status: 400 },
      )
    }

    values.push(params.id)
    const query = `
      UPDATE projects 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await pool.query(query, values)

    return NextResponse.json({
      success: true,
      project: result.rows[0],
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
})

// DELETE - Supprimer un projet
export const DELETE = withAuth(async (req: NextRequest, user: any, { params }: { params: { id: string } }) => {
  try {
    // Vérifier que l'utilisateur est le propriétaire du projet ou un admin
    const projectResult = await pool.query("SELECT client_id FROM projects WHERE id = $1", [params.id])

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Projet non trouvé",
        },
        { status: 404 },
      )
    }

    const project = projectResult.rows[0]
    const isOwner = project.client_id === user.id
    const isAdmin = user.userType === "admin"

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          error: "Accès refusé",
        },
        { status: 403 },
      )
    }

    await pool.query("DELETE FROM projects WHERE id = $1", [params.id])

    return NextResponse.json({
      success: true,
      message: "Projet supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
})

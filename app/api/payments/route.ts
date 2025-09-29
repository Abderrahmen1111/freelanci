import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { pool } from "@/lib/db"
import { z } from "zod"

const createPaymentSchema = z.object({
  projectId: z.string().uuid("ID de projet invalide"),
  amount: z.number().min(1, "Le montant doit être supérieur à 0"),
  paymentMethod: z.enum(["qr_code", "card", "mobile"]),
})

// GET - Récupérer l'historique des paiements
export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const result = await pool.query(
      `SELECT p.*, 
              pr.title as project_title,
              payer.first_name as payer_first_name, payer.last_name as payer_last_name,
              receiver.first_name as receiver_first_name, receiver.last_name as receiver_last_name
       FROM payments p
       LEFT JOIN projects pr ON p.project_id = pr.id
       LEFT JOIN users payer ON p.payer_id = payer.id
       LEFT JOIN users receiver ON p.receiver_id = receiver.id
       WHERE p.payer_id = $1 OR p.receiver_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [user.id, limit, offset],
    )

    return NextResponse.json({
      success: true,
      payments: result.rows,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
})

// POST - Créer un nouveau paiement
export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json()
    const validatedData = createPaymentSchema.parse(body)

    // Vérifier que le projet existe et que l'utilisateur est le client
    const projectResult = await pool.query("SELECT client_id, freelancer_id, budget FROM projects WHERE id = $1", [
      validatedData.projectId,
    ])

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Projet non trouvé",
        },
        { status: 404 },
      )
    }

    const project = projectResult.rows[0]

    if (project.client_id !== user.id) {
      return NextResponse.json(
        {
          error: "Seul le client du projet peut effectuer un paiement",
        },
        { status: 403 },
      )
    }

    if (!project.freelancer_id) {
      return NextResponse.json(
        {
          error: "Aucun freelancer assigné à ce projet",
        },
        { status: 400 },
      )
    }

    // Calculer la commission selon le plan d'abonnement
    const commissionRates = {
      free: 0.15,
      pro: 0.1,
      enterprise: 0.05,
    }

    const commission = validatedData.amount * commissionRates[user.subscriptionPlan]

    // Créer le paiement
    const result = await pool.query(
      `INSERT INTO payments (project_id, payer_id, receiver_id, amount, commission, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [
        validatedData.projectId,
        user.id,
        project.freelancer_id,
        validatedData.amount,
        commission,
        validatedData.paymentMethod,
      ],
    )

    // Ici, vous intégreriez avec un vrai système de paiement
    // Pour la démo, on simule un paiement réussi
    await pool.query("UPDATE payments SET status = $1, transaction_id = $2 WHERE id = $3", [
      "completed",
      `TXN_${Date.now()}`,
      result.rows[0].id,
    ])

    return NextResponse.json(
      {
        success: true,
        payment: result.rows[0],
        message: "Paiement effectué avec succès",
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

    console.error("Erreur lors du paiement:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
})

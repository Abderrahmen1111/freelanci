import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateToken } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = loginSchema.parse(body)

    // Authentifier l'utilisateur
    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        {
          error: "Email ou mot de passe incorrect",
        },
        { status: 401 },
      )
    }

    // Générer le token JWT
    const token = generateToken(user)

    return NextResponse.json({
      success: true,
      user,
      token,
    })
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

    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
}

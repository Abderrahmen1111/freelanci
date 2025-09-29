import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateToken } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  userType: z.enum(["client", "freelancer"]),
  phone: z.string().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = registerSchema.parse(body)

    // Créer l'utilisateur
    const user = await createUser(validatedData)

    // Générer le token JWT
    const token = generateToken(user)

    return NextResponse.json(
      {
        success: true,
        user,
        token,
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

    if (error.code === "23505") {
      // Violation de contrainte unique (email)
      return NextResponse.json(
        {
          error: "Cet email est déjà utilisé",
        },
        { status: 409 },
      )
    }

    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
}

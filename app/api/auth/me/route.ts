import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { getUserById } from "@/lib/auth"

export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    const fullUser = await getUserById(user.id)

    if (!fullUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Retourner les données utilisateur sans le mot de passe
    const { password_hash, ...userData } = fullUser

    return NextResponse.json({
      success: true,
      user: userData,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
})

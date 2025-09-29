import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes qui nécessitent une authentification
const protectedRoutes = [
  "/client-dashboard",
  "/freelancer-dashboard",
  "/admin-dashboard",
  "/subscription",
  "/profile",
  "/settings",
  "/messages",
  "/notifications",
]

// Routes qui nécessitent un abonnement premium
const premiumRoutes = [
  "/client-dashboard/browse", // Parcourir les freelancers
  "/freelancer-dashboard/analytics", // Analytics avancées
  "/api/projects", // Créer des projets (vérifié côté serveur)
  "/api/services", // Créer des services
]

// Routes publiques (pas de redirection)
const publicRoutes = ["/", "/auth/login", "/auth/register", "/about", "/contact", "/terms", "/privacy"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Laisser passer les routes publiques et les assets
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Vérifier l'authentification pour les routes protégées
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      // Rediriger vers la page de connexion
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

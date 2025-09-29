import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { queryDatabase } from "./db"
import type { User } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  userType: "client" | "freelancer" | "admin"
  subscriptionPlan: "free" | "pro" | "enterprise"
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch {
    return null
  }
}

export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  userType: "client" | "freelancer"
  phone?: string
  location?: string
  company?: string
  skills?: string[]
  experience?: string
}): Promise<AuthUser> {
  const hashedPassword = await hashPassword(userData.password)
  const userId = crypto.randomUUID()

  const result = await queryDatabase(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, phone, location, company, skills, experience)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      userData.email,
      hashedPassword,
      userData.firstName,
      userData.lastName,
      userData.userType,
      userData.phone,
      userData.location,
      userData.company,
      userData.skills ? JSON.stringify(userData.skills) : null,
      userData.experience,
    ],
  )

  // Créer l'abonnement gratuit par défaut
  await queryDatabase(`INSERT INTO subscriptions (user_id, plan_id, status) VALUES (?, 'free', 'active')`, [userId])

  return {
    id: userId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    userType: userData.userType,
    subscriptionPlan: "free",
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const result = await queryDatabase(
    "SELECT id, email, password_hash, first_name, last_name, user_type, subscription_plan FROM users WHERE email = ?",
    [email],
  )

  if (!Array.isArray(result.rows) || result.rows.length === 0) {
    return null
  }

  const user = result.rows[0] as any
  const isValidPassword = await verifyPassword(password, user.password_hash)

  if (!isValidPassword) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    userType: user.user_type,
    subscriptionPlan: user.subscription_plan,
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await queryDatabase("SELECT * FROM users WHERE id = ?", [id])

  if (!Array.isArray(result.rows) || result.rows.length === 0) {
    return null
  }

  const user = result.rows[0] as any

  // Parser les skills JSON si elles existent
  if (user.skills && typeof user.skills === "string") {
    try {
      user.skills = JSON.parse(user.skills)
    } catch {
      user.skills = []
    }
  }

  return user
}

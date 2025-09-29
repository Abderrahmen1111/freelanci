import mysql from "mysql2/promise"

// Configuration de la connexion MySQL
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "freelancii_tn",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Créer le pool de connexions
const pool = mysql.createPool(dbConfig)

export { pool }

// Types pour la base de données
export interface User {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  user_type: "client" | "freelancer" | "admin"
  phone?: string
  location?: string
  company?: string
  skills?: string[]
  experience?: string
  avatar_url?: string
  is_verified: boolean
  subscription_plan: "free" | "pro" | "enterprise"
  subscription_expires_at?: Date
  created_at: Date
  updated_at: Date
}

export interface Project {
  id: string
  title: string
  description: string
  client_id: string
  freelancer_id?: string
  budget: number
  status: "draft" | "published" | "in_progress" | "completed" | "cancelled"
  progress: number
  deadline?: Date
  skills_required: string[]
  created_at: Date
  updated_at: Date
}

export interface Service {
  id: string
  freelancer_id: string
  title: string
  description: string
  price_from: number
  category: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Payment {
  id: string
  project_id: string
  payer_id: string
  receiver_id: string
  amount: number
  commission: number
  status: "pending" | "completed" | "failed" | "refunded"
  payment_method: "qr_code" | "card" | "mobile"
  transaction_id?: string
  created_at: Date
  updated_at: Date
}

// Fonction utilitaire pour exécuter des requêtes
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(query, params)
    return results
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête:", error)
    throw error
  }
}

// Fonction utilitaire pour les requêtes avec résultats
export async function queryDatabase(query: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute(query, params)
    return { rows }
  } catch (error) {
    console.error("Erreur lors de la requête:", error)
    throw error
  }
}

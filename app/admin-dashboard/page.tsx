"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Briefcase,
  DollarSign,
  AlertTriangle,
  Search,
  Eye,
  Edit,
  ArrowLeft,
  TrendingUp,
  UserCheck,
  Ban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import AuthWrapper from "@/components/auth-wrapper"
import Sidebar from "@/components/sidebar"
import { demoFreelancers, demoClients, demoProjects, demoStats } from "@/lib/demo-data"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    {
      label: "Utilisateurs Actifs",
      value: demoStats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      change: "+12%",
    },
    {
      label: "Projets en Cours",
      value: demoStats.activeProjects.toString(),
      icon: Briefcase,
      color: "text-green-600",
      change: "+8%",
    },
    {
      label: "Revenus ce Mois",
      value: `${demoStats.monthlyRevenue.toLocaleString()} DT`,
      icon: DollarSign,
      color: "text-yellow-600",
      change: "+15%",
    },
    { label: "Signalements", value: "23", icon: AlertTriangle, color: "text-red-600", change: "-5%" },
  ]

  const users = [
    ...demoFreelancers.slice(0, 3).map((f) => ({
      id: f.id,
      name: f.name,
      email: f.email,
      type: "Freelancer",
      status: f.availability === "Disponible" ? "Actif" : "Occupé",
      joinDate: "15 Dec 2023",
      projects: f.completedProjects,
      rating: f.rating,
    })),
    ...demoClients.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      type: "Client",
      status: "Actif",
      joinDate: c.joinDate,
      projects: c.projectsPosted,
      rating: c.rating,
    })),
  ].slice(0, 6)

  const projects = demoProjects.slice(0, 5)

  const reports = [
    {
      id: 1,
      reporter: "Client123",
      reported: "Ahmed Ben Ali",
      reason: "Retard de livraison",
      status: "En cours",
      date: "10 Jan 2024",
    },
    {
      id: 2,
      reporter: "FreelancerXYZ",
      reported: "Mohamed Sassi",
      reason: "Non-paiement",
      status: "Résolu",
      date: "08 Jan 2024",
    },
  ]

  return (
    <AuthWrapper requireAuth={true} requireSubscription={false}>
      <Sidebar userType="admin" />
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">Retour</span>
            </Link>
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-red-500 to-green-500 rounded-lg flex items-center justify-center"
                animate={{
                  background: [
                    "linear-gradient(45deg, #ef4444, #22c55e)",
                    "linear-gradient(45deg, #22c55e, #3b82f6)",
                    "linear-gradient(45deg, #3b82f6, #ef4444)",
                    "linear-gradient(45deg, #ef4444, #22c55e)",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <motion.span
                  className="text-white font-bold text-xs"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  Fi
                </motion.span>
              </motion.div>
              <span className="text-xl font-bold text-gray-800">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="destructive">Admin</Badge>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 max-w-4xl">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "overview" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "users" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "projects" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Projets
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "reports" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Signalements
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "payments" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Paiements
            </button>
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">{stat.change}</span>
                            </div>
                          </div>
                          <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activité Récente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Nouvel utilisateur inscrit</p>
                          <p className="text-sm text-gray-600">Ahmed Mansouri - Freelancer</p>
                        </div>
                        <span className="text-xs text-gray-500">Il y a 2h</span>
                      </div>
                      <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Projet terminé</p>
                          <p className="text-sm text-gray-600">Logo & Identité - 800 DT</p>
                        </div>
                        <span className="text-xs text-gray-500">Il y a 4h</span>
                      </div>
                      <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Nouveau signalement</p>
                          <p className="text-sm text-gray-600">Retard de livraison</p>
                        </div>
                        <span className="text-xs text-gray-500">Il y a 6h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques Mensuelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Nouveaux utilisateurs</span>
                        <span className="font-semibold">234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Projets créés</span>
                        <span className="font-semibold">156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Projets terminés</span>
                        <span className="font-semibold">89</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Taux de satisfaction</span>
                        <span className="font-semibold">{demoStats.successRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Users Management */}
          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Rechercher des utilisateurs..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Type d'utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="freelancer">Freelancers</SelectItem>
                    <SelectItem value="client">Clients</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Projets</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${user.name}`} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.type === "Freelancer" ? "default" : "secondary"}>{user.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Actif" ? "default" : "destructive"}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>{user.projects}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span>{user.rating}</span>
                              <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                            </div>
                          </TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                {user.status === "Actif" ? (
                                  <Ban className="h-4 w-4" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Projects Management */}
          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Projets</h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Projet</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Freelancer</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Progression</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{project.title}</p>
                              <p className="text-sm text-gray-600">{project.created_at}</p>
                            </div>
                          </TableCell>
                          <TableCell>{project.client.name}</TableCell>
                          <TableCell>{project.freelancer?.name || "Non assigné"}</TableCell>
                          <TableCell className="font-semibold">{project.budget} DT</TableCell>
                          <TableCell>
                            <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                              {project.status === "completed"
                                ? "Terminé"
                                : project.status === "in_progress"
                                  ? "En cours"
                                  : "Ouvert"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{project.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Reports Management */}
          {activeTab === "reports" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Signalements</h2>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Signalé par</TableHead>
                        <TableHead>Utilisateur signalé</TableHead>
                        <TableHead>Raison</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.reporter}</TableCell>
                          <TableCell>{report.reported}</TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>
                            <Badge variant={report.status === "Résolu" ? "default" : "destructive"}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                Résoudre
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Payments Management */}
          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Paiements</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Système QR Code</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="bg-gray-100 rounded-lg p-6">
                      <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">ADMIN QR</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">QR Code Administrateur</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-gray-600">Paiements reçus</p>
                        <p className="font-bold text-green-600">{demoStats.monthlyRevenue.toLocaleString()} DT</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-600">Commission</p>
                        <p className="font-bold text-blue-600">
                          {Math.round(demoStats.monthlyRevenue * 0.1).toLocaleString()} DT
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Transactions Récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Paiement projet</p>
                          <p className="text-sm text-gray-600">Ahmed → Mohamed</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">750 DT</p>
                          <p className="text-sm text-gray-600">Commission: 75 DT</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Retrait freelancer</p>
                          <p className="text-sm text-gray-600">Fatma Trabelsi</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">500 DT</p>
                          <p className="text-sm text-gray-600">Approuvé</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Remboursement</p>
                          <p className="text-sm text-gray-600">Projet annulé</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">300 DT</p>
                          <p className="text-sm text-gray-600">En attente</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AuthWrapper>
  )
}

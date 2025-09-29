"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Star, DollarSign, MessageCircle, Eye, Edit, ArrowLeft, Users, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import AuthWrapper from "@/components/auth-wrapper"
import Sidebar from "@/components/sidebar"
import SubscriptionBanner from "@/components/subscription-banner"
import { demoProjects, demoServices } from "@/lib/demo-data"

export default function FreelancerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const stats = [
    { label: "Projets Actifs", value: "3", icon: Briefcase, color: "text-blue-600" },
    { label: "Revenus ce mois", value: "2,450 DT", icon: DollarSign, color: "text-green-600" },
    { label: "Note moyenne", value: "4.8", icon: Star, color: "text-yellow-600" },
    { label: "Clients satisfaits", value: "127", icon: Users, color: "text-purple-600" },
  ]

  const activeProjects = demoProjects.filter((p) => p.freelancer?.id === "1").slice(0, 3)
  const services = demoServices.filter((s) => s.freelancer_id === "1")

  return (
    <AuthWrapper requireAuth={true} requireSubscription={false}>
      <SubscriptionBanner userId={localStorage.getItem("userId")} />
      <Sidebar userType="freelancer" />
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
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  scale: { duration: 3, repeat: Number.POSITIVE_INFINITY },
                }}
              >
                <span className="text-white font-bold text-xs">Fi</span>
              </motion.div>
              <span className="text-xl font-bold text-gray-800">Freelancer Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>FL</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 max-w-2xl">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "dashboard" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "projects" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Mes Projets
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "services" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Mes Services
            </button>
            <button
              onClick={() => setActiveTab("earnings")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "earnings" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Revenus
            </button>
          </div>

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                    }}
                  >
                    <motion.div
                      whileHover={{
                        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                      }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <motion.p
                                className="text-sm text-gray-600"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                              >
                                {stat.label}
                              </motion.p>
                              <motion.p
                                className="text-2xl font-bold text-gray-800"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                              >
                                {stat.value}
                              </motion.p>
                            </div>
                            <motion.div
                              className={`p-3 rounded-full bg-gray-100 ${stat.color}`}
                              whileHover={{
                                rotate: 360,
                                scale: 1.2,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <stat.icon className="h-6 w-6" />
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Profile Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Profil Freelancer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" />
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">Ahmed Ben Ali</h3>
                      <p className="text-gray-600">Développeur Full Stack</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">4.8</span>
                          <span className="text-gray-500">(127 avis)</span>
                        </div>
                        <Badge>Vérifié</Badge>
                      </div>
                      <p className="text-gray-600 mt-2">
                        Développeur passionné avec 5 ans d'expérience en React, Node.js et MongoDB. Spécialisé dans la
                        création d'applications web modernes et performantes.
                      </p>
                    </div>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Activité Récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Nouveau message de Mohamed Sassi</p>
                        <p className="text-sm text-gray-600">Il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Paiement reçu - 750 DT</p>
                        <p className="text-sm text-gray-600">Il y a 1 jour</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Nouveau projet proposé</p>
                        <p className="text-sm text-gray-600">Il y a 2 jours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Projects */}
          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Mes Projets</h2>
              </div>

              <div className="grid gap-6">
                {activeProjects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                          <p className="text-gray-600">Client: {project.client.name}</p>
                        </div>
                        <Badge variant="secondary">
                          {project.status === "completed"
                            ? "Terminé"
                            : project.status === "in_progress"
                              ? "En cours"
                              : "Ouvert"}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Progression</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{project.progress}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-semibold">{project.budget} DT</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Échéance</p>
                          <p className="font-semibold">{new Date(project.deadline).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                          <Button size="sm" variant="outline">
                            Détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Services */}
          {activeTab === "services" && (
            <AuthWrapper
              requireAuth={true}
              requireSubscription={true}
              requiredPlan="pro"
              fallbackMessage="Créez des services illimités avec un abonnement Pro"
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Mes Services</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Service
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <Card key={service.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                            <p className="text-blue-600 font-medium">À partir de {service.price_from} DT</p>
                          </div>
                          <Badge variant={service.is_active ? "default" : "secondary"}>
                            {service.is_active ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{service.category}</Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add New Service Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ajouter un Nouveau Service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Titre du service</label>
                        <Input placeholder="Ex: Développement site web" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Prix</label>
                        <Input placeholder="Ex: À partir de 500 DT" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Catégorie</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Développement Web</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Textarea placeholder="Décrivez votre service en détail..." rows={4} />
                    </div>
                    <Button>Publier le Service</Button>
                  </CardContent>
                </Card>
              </motion.div>
            </AuthWrapper>
          )}

          {/* Earnings */}
          {activeTab === "earnings" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Revenus</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Demande de Retrait</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Solde disponible</p>
                      <p className="text-2xl font-bold text-green-600">1,250 DT</p>
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Montant à retirer (DT)" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Méthode de retrait" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Virement bancaire</SelectItem>
                          <SelectItem value="mobile">Paiement mobile</SelectItem>
                          <SelectItem value="cash">Espèces</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full">Demander le Retrait</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Historique des Revenus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Site E-commerce</p>
                          <p className="text-sm text-gray-600">Mohamed Sassi</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+750 DT</p>
                          <p className="text-sm text-gray-600">10 Jan 2024</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">App Mobile</p>
                          <p className="text-sm text-gray-600">Startup TechTN</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+1,200 DT</p>
                          <p className="text-sm text-gray-600">05 Jan 2024</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">Retrait</p>
                          <p className="text-sm text-gray-600">Virement bancaire</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">-500 DT</p>
                          <p className="text-sm text-gray-600">01 Jan 2024</p>
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

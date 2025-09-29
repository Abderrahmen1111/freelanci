"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Star, MapPin, DollarSign, MessageCircle, Eye, Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Sidebar from "@/components/sidebar"
import AuthWrapper from "@/components/auth-wrapper"
import SubscriptionBanner from "@/components/subscription-banner"
import { demoFreelancers, demoProjects } from "@/lib/demo-data"

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("browse")
  const [selectedFreelancer, setSelectedFreelancer] = useState(null)

  const freelancers = demoFreelancers
  const myProjects = demoProjects.filter((p) => p.client.id === "1").slice(0, 3)

  return (
    <AuthWrapper requireAuth={true} requireSubscription={false}>
      <SubscriptionBanner userId={localStorage.getItem("userId")} />
      <Sidebar userType="client" />
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
                  boxShadow: [
                    "0 0 10px rgba(239, 68, 68, 0.5)",
                    "0 0 20px rgba(34, 197, 94, 0.5)",
                    "0 0 10px rgba(239, 68, 68, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <motion.span
                  className="text-white font-bold text-xs"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  Fi
                </motion.span>
              </motion.div>
              <span className="text-xl font-bold text-gray-800">Client Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>CL</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 max-w-md">
            <button
              onClick={() => setActiveTab("browse")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "browse" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Parcourir
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
              onClick={() => setActiveTab("payment")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "payment" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Paiements
            </button>
          </div>

          {/* Browse Freelancers */}
          {activeTab === "browse" && (
            <AuthWrapper
              requireAuth={true}
              requireSubscription={true}
              requiredPlan="pro"
              fallbackMessage="Accédez à notre base de freelancers vérifiés avec un abonnement Pro"
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Rechercher des freelancers..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Développement Web</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="writing">Rédaction</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Localisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tunis">Tunis</SelectItem>
                      <SelectItem value="sfax">Sfax</SelectItem>
                      <SelectItem value="sousse">Sousse</SelectItem>
                      <SelectItem value="gabes">Gabès</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Freelancers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {freelancers.map((freelancer) => (
                    <motion.div
                      key={freelancer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Number.parseInt(freelancer.id) * 0.1 }}
                      whileHover={{
                        y: -10,
                        scale: 1.02,
                        boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      <motion.div
                        whileHover={{
                          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(34, 197, 94, 0.05))",
                        }}
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={freelancer.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {freelancer.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-gray-800">{freelancer.name}</h3>
                                  <p className="text-sm text-gray-600">{freelancer.title}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{freelancer.rating}</span>
                                <span className="text-gray-500">({freelancer.reviews})</span>
                              </div>
                              <Badge variant={freelancer.availability === "Disponible" ? "default" : "secondary"}>
                                {freelancer.availability}
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{freelancer.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{freelancer.price}</span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600">{freelancer.description}</p>

                            <div className="flex flex-wrap gap-2">
                              {freelancer.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {freelancer.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{freelancer.skills.length - 3}
                                </Badge>
                              )}
                            </div>

                            <div className="flex space-x-2 pt-2">
                              <Button size="sm" className="flex-1">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contacter
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AuthWrapper>
          )}

          {/* My Projects */}
          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Mes Projets</h2>
                <Button>Nouveau Projet</Button>
              </div>

              <div className="grid gap-6">
                {myProjects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                          <p className="text-gray-600">
                            {project.freelancer ? `avec ${project.freelancer.name}` : "En attente de freelancer"}
                          </p>
                        </div>
                        <Badge variant={project.status === "completed" ? "default" : "secondary"}>
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

          {/* Payment Section */}
          {activeTab === "payment" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Paiements</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Paiement QR Code</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="bg-gray-100 rounded-lg p-6">
                      <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">QR CODE</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Scannez pour payer</p>
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Montant (DT)" />
                      <Input placeholder="Description du paiement" />
                      <Button className="w-full">Générer QR Code</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Historique des Paiements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Ahmed Ben Ali</p>
                          <p className="text-sm text-gray-600">Site E-commerce - Acompte</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">750 DT</p>
                          <p className="text-sm text-gray-600">10 Jan 2024</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Sarra Bouaziz</p>
                          <p className="text-sm text-gray-600">Logo - Paiement final</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">800 DT</p>
                          <p className="text-sm text-gray-600">05 Jan 2024</p>
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

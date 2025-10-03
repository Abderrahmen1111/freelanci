"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import {
  Search,
  Star,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Shield,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { demoFreelancers, demoProjects, demoServices, demoStats } from "@/lib/demo-data"
import Sidebar from "@/components/Sidebar"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [testResult, setTestResult] = useState<string>("")

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

  useEffect(() => {
    axios.get(`${API_BASE}/projects/`)
      .then(res => setTestResult("Connexion OK, projets reçus : " + res.data.length))
      .catch(err => setTestResult("Erreur de connexion au backend"))
  }, [])

  const featuredFreelancers = demoFreelancers.slice(0, 6)
  const recentProjects = demoProjects.slice(0, 4)
  const popularServices = demoServices.slice(0, 3)

  const categories = [
    { value: "all", label: "Toutes catégories" },
    { value: "web", label: "Développement Web" },
    { value: "mobile", label: "Mobile" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "writing", label: "Rédaction" },
  ]

  const stats = [
    { label: "Freelancers Actifs", value: demoStats.totalFreelancers.toLocaleString(), icon: Users },
    { label: "Projets Réalisés", value: demoStats.completedProjects.toLocaleString(), icon: CheckCircle },
    { label: "Clients Satisfaits", value: demoStats.totalClients.toLocaleString(), icon: Star },
    { label: "Taux de Réussite", value: `${demoStats.successRate}%`, icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Sidebar />
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-red-500 to-green-500 rounded-xl flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(239, 68, 68, 0.3)",
                  "0 0 30px rgba(34, 197, 94, 0.3)",
                  "0 0 20px rgba(239, 68, 68, 0.3)",
                ],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY },
              }}
            >
              <motion.span
                className="text-white font-bold text-sm"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Fi
              </motion.span>
            </motion.div>
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Freelancii.tn
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="#freelancers" className="text-gray-600 hover:text-blue-600 transition-colors">
              Freelancers
            </Link>
            <Link href="#projects" className="text-gray-600 hover:text-blue-600 transition-colors">
              Projets
            </Link>
            <Link href="/subscription" className="text-gray-600 hover:text-blue-600 transition-colors">
              Abonnements
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Affichage du test API */}
      <div className="container mx-auto px-4 py-2">
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-yellow-800 font-semibold text-center">
          {testResult}
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              Trouvez le Talent Parfait
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Connectez-vous avec les meilleurs freelancers tunisiens. Des développeurs aux designers, trouvez
              l'expertise dont vous avez besoin pour réussir vos projets.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex flex-col md:flex-row gap-4 bg-white rounded-2xl p-2 shadow-xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Rechercher des freelancers, services..."
                    className="pl-12 border-0 text-lg h-14"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-64 border-0 h-14">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="h-14 px-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Rechercher
                </Button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link href="/auth/register?type=client">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Poster un Projet
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/register?type=freelancer">
                <Button size="lg" variant="outline" className="border-2 bg-transparent">
                  Devenir Freelancer
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="h-8 w-8 text-blue-600" />
                    </motion.div>
                    <motion.h3
                      className="text-3xl font-bold text-gray-800 mb-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section id="freelancers" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Freelancers Vedettes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos freelancers les mieux notés et les plus expérimentés
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFreelancers.map((freelancer, index) => (
              <motion.div
                key={freelancer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={freelancer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {freelancer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">{freelancer.name}</h3>
                        <p className="text-gray-600">{freelancer.title}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{freelancer.rating}</span>
                            <span className="text-gray-500">({freelancer.reviews})</span>
                          </div>
                          <Badge variant="secondary">{freelancer.availability}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{freelancer.location}</span>
                      </div>
                      <span className="font-semibold text-green-600">{freelancer.price}</span>
                    </div>

                    <p className="text-gray-600 text-sm">{freelancer.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.slice(0, 3).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
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
                        Voir Profil
                      </Button>
                      <Button size="sm" variant="outline">
                        Contacter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/freelancers">
              <Button size="lg" variant="outline">
                Voir Tous les Freelancers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section id="services" className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Services Populaires</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les services les plus demandés par nos clients
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                        <p className="text-green-600 font-bold text-xl">À partir de {service.price_from} DT</p>
                      </div>
                      <Badge>{service.category}</Badge>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>⏱️ {service.delivery_time}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                        <span>({service.orders_completed})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={service.freelancer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {service.freelancer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{service.freelancer.name}</span>
                    </div>

                    <Button className="w-full">Commander Maintenant</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section id="projects" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Projets Récents</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les derniers projets publiés par nos clients
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                      </div>
                      <Badge variant={project.status === "published" ? "default" : "secondary"}>
                        {project.status === "published" ? "Ouvert" : "En cours"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-semibold ml-2">{project.budget} DT</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Catégorie:</span>
                        <span className="font-semibold ml-2">{project.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Échéance:</span>
                        <span className="font-semibold ml-2">
                          {new Date(project.deadline).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Client:</span>
                        <span className="font-semibold ml-2">{project.client.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills_required.slice(0, 3).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {project.skills_required.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.skills_required.length - 3}
                        </Badge>
                      )}
                    </div>

                    <Button className="w-full" variant={project.status === "published" ? "default" : "outline"}>
                      {project.status === "published" ? "Postuler" : "Voir Détails"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects">
              <Button size="lg" variant="outline">
                Voir Tous les Projets
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Pourquoi Choisir Freelancii.tn ?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              La plateforme de référence pour connecter talents et opportunités en Tunisie
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Paiements Sécurisés",
                description: "Système de paiement sécurisé avec protection des fonds jusqu'à la livraison",
              },
              {
                icon: Award,
                title: "Talents Vérifiés",
                description: "Tous nos freelancers sont vérifiés et évalués par la communauté",
              },
              {
                icon: Zap,
                title: "Support 24/7",
                description: "Équipe de support disponible pour vous accompagner à tout moment",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <motion.div
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="h-10 w-10" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="opacity-90">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Prêt à Commencer ?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de freelancers et clients qui font confiance à Freelancii.tn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?type=client">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  Commencer un Projet
                </Button>
              </Link>
              <Link href="/auth/register?type=freelancer">
                <Button size="lg" variant="outline">
                  Rejoindre comme Freelancer
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Fi</span>
                </div>
                <span className="text-xl font-bold">Freelancii.tn</span>
              </div>
              <p className="text-gray-400 mb-4">
                La plateforme de référence pour connecter freelancers et clients en Tunisie.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Pour les Clients</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/projects" className="hover:text-white transition-colors">
                    Poster un Projet
                  </Link>
                </li>
                <li>
                  <Link href="/freelancers" className="hover:text-white transition-colors">
                    Trouver des Freelancers
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white transition-colors">
                    Parcourir les Services
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Pour les Freelancers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/projects" className="hover:text-white transition-colors">
                    Trouver du Travail
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white transition-colors">
                    Créer un Service
                  </Link>
                </li>
                <li>
                  <Link href="/subscription" className="hover:text-white transition-colors">
                    Plans Premium
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Centre d'Aide
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Nous Contacter
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Conditions d'Utilisation
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Freelancii.tn. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

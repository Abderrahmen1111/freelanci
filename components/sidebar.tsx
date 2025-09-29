"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Menu } from "lucide-react"

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Zone de détection du curseur */}
      <div
        className="fixed top-0 left-0 h-full w-2 z-50"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ cursor: "pointer" }}
      />
      {/* Sidebar */}
      <motion.div
        initial={{ x: -260 }}
        animate={{ x: open ? 0 : -260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40 flex flex-col p-6 border-r border-gray-200"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex items-center mb-8 space-x-2">
          <Menu className="text-blue-600" />
          <span className="font-bold text-xl text-blue-700">Menu</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link href="/" className="hover:text-blue-600 font-medium">Accueil</Link>
          <Link href="#services" className="hover:text-blue-600 font-medium">Services</Link>
          <Link href="#freelancers" className="hover:text-blue-600 font-medium">Freelancers</Link>
          <Link href="#projects" className="hover:text-blue-600 font-medium">Projets</Link>
          <Link href="/subscription" className="hover:text-blue-600 font-medium">Abonnements</Link>
          <Link href="/auth/login" className="hover:text-blue-600 font-medium">Connexion</Link>
          <Link href="/auth/register" className="hover:text-blue-600 font-medium">S'inscrire</Link>
        </nav>
      </motion.div>
    </>
  )
}

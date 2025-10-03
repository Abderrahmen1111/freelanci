"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/`)
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Liste des projets</h1>
      <ul>
        {projects.map((project: any) => (
          <li key={project.id}>{project.title}</li>
        ))}
      </ul>
    </div>
  )
}
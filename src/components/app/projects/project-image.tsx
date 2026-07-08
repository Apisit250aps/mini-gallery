'use client'
import { Project } from '@/domains/entities/project'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

export default function ProjectImage({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      key={project.id}
      className="block group"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: Math.min(index * 0.1, 0.4),
        }}
        viewport={{ once: true }}
        className="overflow-hidden bg-card hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
      >
        <div className="overflow-hidden relative aspect-video bg-muted">
          <Image
            src={project.images[0]}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            priority={index < 3}
          />
          {project.images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs px-2 py-1 rounded text-[10px] text-white font-medium z-10">
              {project.images.length} Photos
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between grow px-5 py-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {project.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.description || 'No description provided.'}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
            <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
              {project.tags && project.tags.length > 0
                ? project.tags[0]
                : 'Architecture'}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {project.createdAt
                ? new Date(project.createdAt).getFullYear().toString()
                : '2025'}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

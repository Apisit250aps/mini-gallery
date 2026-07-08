import { projectRepository, userRepository } from '@/infrastructures'
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/app/projects/project-detail'

const defaultProjects = [
  {
    id: "default-1",
    name: "Modern Concrete Pavilion",
    slug: "modern-concrete-pavilion",
    createdAt: "2025-01-01T00:00:00.000Z",
    tags: ["Architecture", "Brutalist", "Concrete"],
    description: "An elegant structure crafted from raw concrete, highlighting minimalist geometric forms juxtaposed against a serene natural environment during twilight.",
    images: [
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modern Architectural Elegance at Twilight.png",
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modernist Architecture in Lush Forest.png"
    ],
    creator: "Studio Arch",
  },
  {
    id: "default-2",
    name: "Colorful Urban Living",
    slug: "colorful-urban-living",
    createdAt: "2025-01-01T00:00:00.000Z",
    tags: ["Urban Design", "Botanical", "Modernist"],
    description: "A bold exploration of color and space in urban settings, blending lush botanical integration with clean structural grids to redefine city living.",
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modernist Architecture in Lush Forest.png"],
    creator: "Urban Collective",
  },
  {
    id: "default-3",
    name: "Minimalist Home Retreat",
    slug: "minimalist-home-retreat",
    createdAt: "2025-01-01T00:00:00.000Z",
    tags: ["Interior", "Minimalist", "Retreat"],
    description: "A sanctuary of peace designed around monochromatic simplicity, tactile textures, and natural lighting to create a soothing indoor experience.",
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg"],
    creator: "Nordic Dwelling",
  },
  {
    id: "default-4",
    name: "Urban Concrete House",
    slug: "urban-concrete-house",
    createdAt: "2025-01-01T00:00:00.000Z",
    tags: ["Product Design", "Brutalist", "Concrete"],
    description: "An innovative take on high-density residential architecture, featuring exposed concrete facades and space-optimized vertical programming.",
    images: ["https://deifkwefumgah.cloudfront.net/photos/tiny-home/erik-mclean-g3U7sqtdJ1w-unsplash.jpg"],
    creator: "Habitat Lab",
  },
  {
    id: "default-5",
    name: "Luxury Concrete Box",
    slug: "luxury-concrete-box",
    createdAt: "2025-01-01T00:00:00.000Z",
    tags: ["Residential", "Brutalist", "Concrete"],
    description: "A premium private residence maximizing brutalist expression through clean concrete spans, wide-open glazing, and custom architectural detailing.",
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw14.jpeg"],
    creator: "Studio Arch",
  },
  {
    id: "default-6",
    name: "Glasshouse in Nature",
    slug: "glasshouse-in-nature",
    createdAt: "2025-01-01T00:00:00.000Z",
    tags: ["Sustainable Design", "Ecology", "Glasshouse"],
    description: "A transparent pavilion designed to integrate seamlessly into its forested surroundings, utilizing passive solar heating and local materials.",
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw16.jpeg"],
    creator: "Eco Arch",
  },
];

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params

  // 1. Look for fallback/mock projects first
  const fallback = defaultProjects.find((p) => p.slug === slug)
  if (fallback) {
    return <ProjectDetail project={fallback} />
  }

  // 2. Query MongoDB by slug
  let project
  try {
    const dbProject = await projectRepository.findOneBySlug(slug)
    if (!dbProject || !dbProject.isActive) {
      notFound()
    }

    // Resolve creator name from user collection
    let creatorName = "Private Client"
    if (dbProject.creator) {
      try {
        const user = await userRepository.findById(dbProject.creator)
        if (user) {
          creatorName = user.name || user.email
        }
      } catch (err) {
        console.error("Error looking up project creator by user id:", err)
      }
    }

    project = {
      id: dbProject.id,
      name: dbProject.name,
      slug: dbProject.slug,
      tags: dbProject.tags,
      creator: creatorName,
      description: dbProject.description,
      images: dbProject.images,
      createdAt: dbProject.createdAt ? dbProject.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: dbProject.updatedAt ? dbProject.updatedAt.toISOString() : null,
    }
  } catch (error) {
    console.error("Error loading project by slug in SSR page:", error)
    notFound()
  }

  return <ProjectDetail project={project} />
}

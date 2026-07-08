import { projectRepository } from '@/infrastructures'
import { notFound } from 'next/navigation'
import { Project1 } from '@/components/project1'

const defaultProjects = [
  {
    id: "default-1",
    title: "Modern Concrete Pavilion",
    slug: "modern-concrete-pavilion",
    img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modern Architectural Elegance at Twilight.png",
    year: "2025",
    type: "Architecture",
    description: "An elegant structure crafted from raw concrete, highlighting minimalist geometric forms juxtaposed against a serene natural environment during twilight.",
    images: [
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modern Architectural Elegance at Twilight.png",
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modernist Architecture in Lush Forest.png"
    ],
    tags: ["Architecture", "Brutalist", "Concrete"],
    creator: "Studio Arch",
  },
  {
    id: "default-2",
    title: "Colorful Urban Living",
    slug: "colorful-urban-living",
    img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modernist Architecture in Lush Forest.png",
    year: "2025",
    type: "Urban Design",
    description: "A bold exploration of color and space in urban settings, blending lush botanical integration with clean structural grids to redefine city living.",
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modernist Architecture in Lush Forest.png"],
    tags: ["Urban Design", "Lush Forest", "Modernist"],
    creator: "Urban Collective",
  },
  {
    id: "default-3",
    title: "Minimalist Home Retreat",
    slug: "minimalist-home-retreat",
    img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg",
    year: "2025",
    type: "Interior",
    description: "A sanctuary of peace designed around monochromatic simplicity, tactile textures, and natural lighting to create a soothing indoor experience.",
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg"],
    tags: ["Interior", "Minimalist", "Retreat"],
    creator: "Nordic Dwelling",
  },
  {
    id: "default-4",
    title: "Urban Concrete House",
    slug: "urban-concrete-house",
    img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/tiny-home/erik-mclean-g3U7sqtdJ1w-unsplash.jpg",
    year: "2025",
    type: "Product Design",
    description: "An innovative take on high-density residential architecture, featuring exposed concrete facades and space-optimized vertical programming.",
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/tiny-home/erik-mclean-g3U7sqtdJ1w-unsplash.jpg"],
    tags: ["Product Design", "Brutalist", "Concrete"],
    creator: "Habitat Lab",
  },
  {
    id: "default-5",
    title: "Luxury Concrete Box",
    slug: "luxury-concrete-box",
    img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw14.jpeg",
    year: "2025",
    type: "Residential",
    description: "A premium private residence maximizing brutalist expression through clean concrete spans, wide-open glazing, and custom architectural detailing.",
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw14.jpeg"],
    tags: ["Residential", "Brutalist", "Concrete"],
    creator: "Studio Arch",
  },
  {
    id: "default-6",
    title: "Glasshouse in Nature",
    slug: "glasshouse-in-nature",
    img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw16.jpeg",
    year: "2025",
    type: "Sustainable Design",
    description: "A transparent pavilion designed to integrate seamlessly into its forested surroundings, utilizing passive solar heating and local materials.",
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw16.jpeg"],
    tags: ["Sustainable Design", "Ecology", "Glasshouse"],
    creator: "Eco Arch",
  },
];

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Look for fallback/mock projects first
  const fallback = defaultProjects.find((p) => p.slug === slug);
  if (fallback) {
    return <Project1 project={fallback} />;
  }

  // 2. Query MongoDB by slug
  try {
    const dbProject = await projectRepository.findOneBySlug(slug);
    if (!dbProject || !dbProject.isActive) {
      notFound();
    }

    const project = {
      id: dbProject.id,
      title: dbProject.name,
      description: dbProject.description,
      year: dbProject.createdAt ? new Date(dbProject.createdAt).getFullYear().toString() : '2025',
      type: dbProject.tags && dbProject.tags.length > 0 ? dbProject.tags[0] : 'Architecture',
      images: dbProject.images && dbProject.images.length > 0 ? dbProject.images : ['https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modern Architectural Elegance at Twilight.png'],
      slug: dbProject.slug,
      tags: dbProject.tags,
      creator: dbProject.creator,
    };

    return <Project1 project={project} />;
  } catch (error) {
    console.error("Error loading project by slug in SSR page:", error);
    notFound();
  }
}

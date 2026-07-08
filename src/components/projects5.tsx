"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export interface ProjectItem {
  id: string;
  title: string;
  img: string;
  year: string;
  type: string;
  description?: string | null;
  images: string[];
  slug: string;
}

const defaultProjects: ProjectItem[] = [
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
  },
];

interface Projects5Props {
  className?: string;
  projects?: ProjectItem[];
}

const Projects5 = ({ className, projects = [] }: Projects5Props) => {
  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Header Section */}
      <header className="container mx-auto px-6 pt-24 pb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2">
            Creative Portfolio
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight uppercase mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent sm:text-6xl">
            Mini Gallery
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A beautiful curated space showcasing modern concrete pavilions, glasshouses in nature, and minimalist spatial designs.
          </p>
        </div>
      </header>

      {/* Projects Grid Section */}
      <section className={cn("py-12 pb-24", className)}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((project, index) => (
              <Link href={`/projects/${project.slug}`} key={project.id} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.4) }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-xl border border-border/60 bg-card hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
                >
                  <div className="overflow-hidden relative aspect-video bg-muted">
                    <Image
                      src={project.img}
                      alt={project.title}
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
                  <div className="flex flex-col justify-between flex-grow px-5 py-4">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                      <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {project.type}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {project.year}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { Projects5 };
export default Projects5;

"use client";

import { motion, useInView } from "framer-motion";
import { MoveUpRight, ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { ProjectMediaViewer } from "./project-media-viewer";

// Import react-photo-view styles
import "react-photo-view/dist/react-photo-view.css";

export interface ProjectDetailProps {
  className?: string;
  project: {
    id: string;
    name: string;
    slug: string;
    tags: string[];
    creator: string;
    description: string | null;
    images: string[];
    createdAt: string; // ISO string or date string
    updatedAt?: string | null;
  };
}

const FadeUpOnScroll = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const ProjectDetail = ({ className, project }: ProjectDetailProps) => {
  // Split title dynamically to preserve the editorial style:
  // First word is standard font weight, the rest is light.
  const titleParts = project.name.split(" ");
  const firstWord = titleParts[0] || "Project";
  const restOfTitle = titleParts.slice(1).join(" ") || "Details";

  // Parse paragraphs of description
  const paragraphs = project.description
    ? project.description.split("\n\n")
    : ["No description provided for this project."];

  const year = project.createdAt
    ? new Date(project.createdAt).getFullYear().toString()
    : "2025";

  const primaryTag = project.tags && project.tags.length > 0
    ? project.tags[0]
    : "Architecture";

  const tagsList = project.tags && project.tags.length > 0
    ? project.tags.join(", ")
    : "Design";

  const projectDetails = [
    { label: "Creator", value: project.creator || "Private Client" },
    { label: "Year", value: year },
    { label: "Type", value: primaryTag },
    { label: "Tags", value: tagsList },
  ] as const;

  // Render all project images in the bottom grid
  const gridImages = project.images || [];

  return (
    <PhotoProvider>
      <section className={cn("py-8 lg:py-24 bg-background text-foreground font-sans", className)}>
        <div className="container space-y-6 mx-auto px-6">
          
          {/* Back Link */}
          {/* <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Gallery
            </Link>
          </div> */}

          <FadeUpOnScroll>
            <header className="border-b border-border pb-6 md:pb-8">
              <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
                <h1 className="text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl tracking-tight uppercase">
                  {firstWord}
                </h1>
                <h2 className="text-3xl font-light text-muted-foreground md:text-4xl lg:text-5xl tracking-tight uppercase">
                  {restOfTitle}
                </h2>
              </div>
            </header>
          </FadeUpOnScroll>

          <div className="flex flex-col md:flex-row md:justify-between font-medium gap-4">
            <p className="max-w-3xl leading-relaxed text-muted-foreground">
              A dynamic display of structural layout, materials design, and aesthetic environment.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm self-start"
            >
              Back to Home Gallery <MoveUpRight className="h-4 w-5" />
            </Link>
          </div>

          {/* Carousel Media Viewer with Flicking & PhotoView */}
          <FadeUpOnScroll delay={0.15}>
            <ProjectMediaViewer images={project.images} title={project.name} />
          </FadeUpOnScroll>

          <FadeUpOnScroll delay={0.25}>
            <div className="flex flex-col items-end justify-end py-4 md:py-6">
              <div className="space-y-6 lg:w-1/2 w-full">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {para}
                  </p>
                ))}

                <div className="space-y-4 pt-4">
                  {projectDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex flex-col border-b border-border py-3 text-sm sm:flex-row sm:items-center sm:justify-between md:text-base"
                    >
                      <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        {detail.label}
                      </span>
                      <span className="font-semibold text-foreground mt-1 sm:mt-0">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUpOnScroll>

          {/* Bottom Grid displaying all images with PhotoView expand triggers */}
          {gridImages.length > 0 && (
            <FadeUpOnScroll delay={0.3}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-6 pt-8 border-t border-border/40">
                {gridImages.map((src, i) => (
                  <div
                    key={i}
                    className="overflow-hidden relative aspect-video w-full bg-muted cursor-zoom-in group/gridimage"
                  >
                    <PhotoView src={src}>
                      <div className="relative w-full h-full">
                        <Image
                          src={src}
                          alt={`${project.name} detail view ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 500px"
                          className="object-cover transition-transform duration-500 group-hover/gridimage:scale-103"
                        />
                      </div>
                    </PhotoView>
                  </div>
                ))}
              </div>
            </FadeUpOnScroll>
          )}
        </div>
      </section>
    </PhotoProvider>
  );
};

export { ProjectDetail };
export default ProjectDetail;

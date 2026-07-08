"use client";

import { motion, useInView } from "framer-motion";
import { MoveUpRight, ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export interface Project1Props {
  className?: string;
  project: {
    id: string;
    title: string;
    description: string | null;
    year: string;
    type: string;
    images: string[];
    slug: string;
    tags?: string[];
    creator?: string;
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

const Project1 = ({ className, project }: Project1Props) => {
  // Split title dynamically to preserve the editorial style:
  // First word is standard font weight, the rest is light.
  const titleParts = project.title.split(" ");
  const firstWord = titleParts[0] || "Project";
  const restOfTitle = titleParts.slice(1).join(" ") || "Details";

  // Parse paragraphs of description
  const paragraphs = project.description
    ? project.description.split("\n\n")
    : ["No description provided for this project."];

  // Resolve images
  const heroImage = project.images && project.images.length > 0
    ? project.images[0]
    : "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/tiny-home/erik-mclean-g3U7sqtdJ1w-unsplash.jpg";

  const gridImages = project.images && project.images.length > 1
    ? project.images.slice(1)
    : [];

  const projectDetails = [
    { label: "Creator", value: project.creator || "Private Client" },
    { label: "Year", value: project.year },
    { label: "Type", value: project.type },
    { label: "Tags", value: project.tags && project.tags.length > 0 ? project.tags.join(", ") : "Design" },
  ] as const;

  return (
    <section className={cn("py-8 lg:py-24 bg-background text-foreground font-sans", className)}>
      <div className="container max-w-5xl space-y-6 mx-auto px-6">
        
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Gallery
          </Link>
        </div>

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

        <FadeUpOnScroll delay={0.15}>
          <div className="overflow-hidden rounded-sm border border-border relative aspect-[16/7] w-full bg-muted">
            <Image
              src={heroImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
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

        {gridImages.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-6 pt-4">
            {gridImages.map((src, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-sm border border-border relative aspect-video w-full bg-muted"
              >
                <Image
                  src={src}
                  alt={`${project.title} detail view ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover transition-transform duration-500 hover:scale-103"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export { Project1 };
export default Project1;

'use client'

import { useProjectContext } from '@/hooks/contexts/project-provider'
import { FilterMailIcon, Menu01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { useState } from 'react'

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { categories, activeCategorySlug, getCategoryHref } =
    useProjectContext()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navTextClass =
    'text-base lowercase font-extralight hover:text-black transition-colors'
  const activeNavTextClass = 'text-black font-light'

  return (
    <>
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/60">
        <div className="px-5 sm:px-10 lg:px-15 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-center lg:justify-start lg:flex-1">
              <Link
                href="/"
                className="text-lg tracking-[0.2em] uppercase font-light"
              >
                Mini Gallery
              </Link>
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:justify-center">
              <ul className="flex gap-x-4">
                <li>
                  <Link
                    href={getCategoryHref('')}
                    className={`${navTextClass} ${!activeCategorySlug ? activeNavTextClass : ''}`}
                  >
                    All
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={getCategoryHref(category.slug)}
                      className={`${navTextClass} ${
                        activeCategorySlug === category.slug
                          ? activeNavTextClass
                          : ''
                      }`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <ul className="flex gap-x-3">
                <li>
                  <Link href="/" className={navTextClass}>
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/about" className={navTextClass}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={navTextClass}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex lg:hidden items-center justify-between">
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent/40 transition-colors"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsFilterOpen((prev) => !prev)
                }}
                id="filter"
                aria-label="filter"
              >
                <HugeiconsIcon
                  icon={FilterMailIcon}
                  strokeWidth={2}
                  className="size-5"
                />
              </button>

              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent/40 transition-colors"
                onClick={() => {
                  setIsFilterOpen(false)
                  setIsMenuOpen((prev) => !prev)
                }}
                id="menu"
                aria-label="menu"
              >
                <HugeiconsIcon
                  icon={Menu01Icon}
                  strokeWidth={2}
                  className="size-5"
                />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isFilterOpen
              ? 'max-h-80 opacity-100 border-t border-border/60'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-background px-5 sm:px-10 lg:px-15 py-4 shadow-sm">
            <ul className="flex flex-col gap-y-2 mt-2">
              <li>
                <Link
                  href={getCategoryHref('')}
                  onClick={() => setIsFilterOpen(false)}
                  className={`block w-full text-left ${navTextClass} ${
                    !activeCategorySlug ? activeNavTextClass : ''
                  }`}
                >
                  All
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={getCategoryHref(category.slug)}
                    onClick={() => setIsFilterOpen(false)}
                    className={`block w-full text-left ${navTextClass} ${
                      activeCategorySlug === category.slug
                        ? activeNavTextClass
                        : ''
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen
              ? 'max-h-60 opacity-100 border-t border-border/60'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-background px-5 sm:px-10 lg:px-15 py-4 shadow-sm">
            <ul className="flex flex-col gap-y-2 mt-2">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={navTextClass}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className={navTextClass}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={navTextClass}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {children}
    </>
  )
}

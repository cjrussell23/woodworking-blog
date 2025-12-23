'use client'

import React, { useEffect, useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Menu, SearchIcon, X } from 'lucide-react'
import Link from 'next/link'

export const HeaderNav: React.FC<{ data: HeaderType; isScrolled: boolean }> = ({
  data,
  isScrolled,
}) => {
  const navItems = data?.navItems || []
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const textColor = isScrolled
    ? 'text-foreground '
    : 'text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]'
  const iconColor = isScrolled
    ? 'text-foreground '
    : 'text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]'

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-3 items-center">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" className={`${textColor} text-xl`} />
        })}
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className={`w-5 ${iconColor}`} />
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className={`w-6 h-6 ${iconColor}`} />
        ) : (
          <Menu className={`w-6 h-6 ${iconColor}`} />
        )}
      </button>

      {/* Mobile Navigation Sheet */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[60] md:hidden animate-in fade-in duration-500"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Fade-in Sheet */}
          <div className="fixed inset-0 w-full bg-card z-[70] md:hidden flex flex-col animate-in fade-in duration-500">
            {/* Header with Logo and Close Button - aligned with main header */}
            <div className="py-2 container flex justify-between items-center">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo loading="eager" priority="high" className="size-12" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className=""
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="container flex flex-col items-end pr-6 gap-6 py-6 flex-1">
              {navItems.map(({ link }, i) => {
                return (
                  <CMSLink
                    onClick={() => setIsMobileMenuOpen(false)}
                    key={i}
                    {...link}
                    appearance="link"
                    className="text-foreground text-2xl font-medium"
                  />
                )
              })}
              <Link
                href="/search"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-foreground text-2xl font-medium"
              >
                <SearchIcon className="w-6 text-foreground" />
                Search
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  )
}

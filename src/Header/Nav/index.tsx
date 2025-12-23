'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'

export const HeaderNav: React.FC<{ data: HeaderType; isScrolled: boolean }> = ({
  data,
  isScrolled,
}) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={isScrolled ? 'text-foreground text-xl' : 'text-white text-xl'}
          />
        )
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className={isScrolled ? 'w-5 text-black' : 'w-5 text-white'} />
      </Link>
    </nav>
  )
}

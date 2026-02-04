'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchRole() {
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (data) setRole(data.role)
      }
    }
    if (isLoaded && user) fetchRole()
  }, [isLoaded, user])

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/marketplace', label: 'Galerie' },
    { href: '/print-on-demand', label: 'Studio' },
    { href: '/auction', label: 'Enchères' },
    { href: '/about', label: 'À Propos' },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b border-transparent",
        scrolled ? "bg-background/90 backdrop-blur-md py-4 border-border/50" : "bg-transparent py-8"
      )}
    >
      <div className="max-w-[1800px] mx-auto px-6 sm:px-12 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-foreground text-xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? 'Fermer' : 'Menu'}
        </button>

        {/* Desktop Navigation - Left */}
        <nav className="hidden lg:flex items-center gap-12">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full opacity-50" />
            </Link>
          ))}
        </nav>

        {/* Logo - Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <Link href="/" className="block group">
            <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-foreground transition-colors duration-300">
              PLENUM<span className="text-secondary italic font-serif">.</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation - Right */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.slice(3).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full opacity-50" />
            </Link>
          ))}

          {role === 'admin' && (
            <Link href="/admin" className="text-xs uppercase tracking-[0.2em] text-red-600 hover:text-red-800 font-bold transition-colors">
              Admin
            </Link>
          )}

          {role === 'artist' && (
            <Link href="/artist" className="text-xs uppercase tracking-[0.2em] text-primary hover:text-secondary font-bold transition-colors">
              Studio
            </Link>
          )}

          {/* Auth Buttons */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition-colors">
                Connexion
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <button className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition-colors">
            Panier (0)
          </button>
        </div>

        {/* Mobile Cart/Account placeholders */}
        <div className="lg:hidden flex gap-4 items-center">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <span className="text-sm">Panier (0)</span>
        </div>

        {/* Mobile Full Screen Menu */}
        <div className={cn(
          "fixed inset-0 bg-background z-40 flex flex-col items-center justify-center transition-all duration-500 ease-in-out lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-3xl font-heading text-foreground hover:text-secondary italic transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-[1px] w-12 bg-border my-4" />

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm uppercase tracking-widest" onClick={() => setIsOpen(false)}>Connexion</button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}

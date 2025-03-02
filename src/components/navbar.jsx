"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, LogIn, Users, Package, User, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"

export function Navbar() {
  const location = useLocation()
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/members", label: "Members", icon: Users },
    { to: "/products", label: "Products", icon: Package },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-lg supports-[backdrop-filter]:bg-slate-50/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand - Always visible */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-slate-800 dark:text-slate-100 hover:text-primary transition-colors"
            >
              <span className="hidden sm:inline">YourBrand</span>
              <Home className="h-6 w-6 sm:hidden" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <SignedIn>
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-slate-600 hover:text-primary hover:bg-primary/10 dark:text-slate-300 dark:hover:text-primary dark:hover:bg-primary/20",
                  )}
                >
                  <link.icon className="h-5 w-5 mr-2" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Hi, {user?.username || "Guest"}
              </span>
              <UserButton />
              <ModeToggle />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </Link>
              <ModeToggle />
            </div>
          </SignedOut>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
            >
              <div className="flex flex-col h-full py-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Menu</h2>
                  <ModeToggle />
                </div>

                <SignedIn>
                  <div className="flex flex-col space-y-3">
                    {links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          location.pathname === link.to
                            ? "text-primary bg-primary/10"
                            : "text-slate-600 hover:text-primary hover:bg-primary/10 dark:text-slate-300 dark:hover:text-primary dark:hover:bg-primary/20",
                        )}
                      >
                        <link.icon className="h-5 w-5 mr-3" />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {user?.username || "Guest"}
                      </span>
                      <UserButton />
                    </div>
                  </div>
                </SignedIn>

                <SignedOut>
                  <div className="flex flex-col space-y-3">
                    <Link to="/sign-in" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/sign-up" className="w-full">
                      <Button variant="default" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}


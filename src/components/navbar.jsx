import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight, LogIn, Users, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  const location = useLocation();
  const { user } = useUser();

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/members", label: "Members", icon: Users },
    { to: "/products", label: "Products", icon: Package },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-md border-b bg-opacity-5 bg-[hsl(var(--background))]">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <SignedIn>
            <div className="flex items-center space-x-5">
              {links.map((link, index) => (
                <div key={link.to} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                  )}
                  <Link
                    to={link.to}
                    className={cn(
                      "flex items-center space-x-2 text-lg font-medium transition-colors",
                      location.pathname === link.to
                        ? "text-[hsl(var(--primary))]"  // Primary color for active link
                        : "text-[hsl(var(--secondary-foreground))] hover:text-[hsl(var(--primary))]" // Secondary color for hover
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <h1 className="text-[hsl(var(--muted-foreground))] text-lg font-semibold">
                Welcome, {user?.username || "Guest"}!
              </h1>
              <UserButton />
       
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center space-x-4">
              <Link to="/sign-in">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-foreground))] text-[hsl(var(--primary-foreground))] shadow"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center space-x-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-foreground))] text-[hsl(var(--primary-foreground))] shadow"
                >
                  <User className="h-4 w-4" />
                  <span>Sign Up</span>
                </Button>
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

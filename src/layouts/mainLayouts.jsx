import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { SignedOut, SignedIn } from "@clerk/clerk-react";
import { ThemeProvider } from "@/components/theme-provider";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20 dark:bg-background dark:text-foreground">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Navbar />
      <main className="flex-1 container mx-auto p-6 pt-16 bg-gradient-to-b from-background to-muted/20 shadow-lg border border-border rounded-lg">
        <Outlet /> {/* This is where child routes will be rendered */}
        <Toaster richColors />
      </main>
      </ThemeProvider>
    </div>
  );
};

export default MainLayout;

import { SignIn } from "@clerk/clerk-react";
import { AuroraText } from "@/components/magicui/aurora-text";
import { MorphingText } from "@/components/magicui/morphing-text";
import { Milk, ChevronsUpIcon as Cheese, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const texts = [
  "Fresh Milk",
  "Cheese",
  "Butter",
  "Cream",
  "Yogurt",
  "Dairy",
  "Smooth",
  "Tasty",
  "Farm Fresh",
];

export default function LandingPage() {
  return (
    <div className="h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Single Section with Flex Layout */}
      <div className="flex flex-col md:flex-row h-full w-full max-w-7xl mx-auto px-6 py-12 gap-12">
        {/* Left Section with AuroraText and MorphingText */}
        <div className="flex-1 flex flex-col justify-center items-start">
          <div className="mb-8 relative">
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
              Sign In To <AuroraText>Shop Dairy World</AuroraText>
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-xl">
              Your daily dose of fresh dairy is just a click away! Experience
              the richness of farm-fresh products delivered to your doorstep.
            </p>
          </div>
        </div>

        {/* Right Section with SignIn */}
        <div className="flex-1 flex flex-col justify-center items-center gap-8">
          <div className="relative w-full max-w-sm">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
            <div className="relative z-10">
              <SignIn
                appearance={{
                  elements: {
                    card: "shadow-lg rounded-lg p-8 bg-gray-800",
                    headerTitle: "text-3xl font-bold text-white",
                    formFieldLabel: "text-white", // Ensure labels are readable
                    formFieldInput:
                      "border border-gray-700 bg-gray-900 text-white",
                    socialButtons: "bg-blue-600 hover:bg-blue-700",
                    formButtonPrimary:
                      "bg-blue-500 text-white hover:bg-blue-600",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

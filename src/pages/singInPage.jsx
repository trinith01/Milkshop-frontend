"use client"

import { SignIn } from "@clerk/clerk-react"
import { ShoppingCart, Truck, BarChart4, Users } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 leading-tight">
                Streamline Your Dairy Business Operations
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Our comprehensive point-of-sale system is tailored for dairy farmers, retailers, and distributors.
                Efficiently manage inventory, track sales, and grow your business with ease.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">Streamlined Sales</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <Truck className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">Delivery Management</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <BarChart4 className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">Advanced Analytics</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">Customer Insights</span>
              </div>
            </div>
          </div>

          {/* Right Column - Sign In */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-xl rounded-2xl max-w-md mx-auto">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-8 bg-transparent w-full",
                    headerTitle: "text-2xl font-bold text-gray-900 text-center",
                    headerSubtitle: "text-base text-gray-600 text-center mt-2 mb-6",
                    socialButtonsBlockButton:
                      "w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg mb-2 relative",
                    socialButtonsBlockButtonText: "font-medium text-gray-700",
                    dividerLine: "bg-gray-200",
                    dividerText: "text-gray-500 mx-4 bg-white px-3",
                    formFieldLabel: "text-sm font-medium text-gray-700 mb-1.5",
                    formFieldInput:
                      "w-full px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    formButtonPrimary:
                      "w-full bg-[#0071e3] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg mt-6 transition-colors",
                    footerActionText: "text-sm text-gray-600 text-center mt-6",
                    footerActionLink: "text-[#0071e3] hover:text-blue-700 font-medium",
                    formFieldAction: "text-sm text-[#0071e3] hover:text-blue-700",
                    identityPreviewText: "text-gray-700",
                    identityPreviewEditButton: "text-[#0071e3] hover:text-blue-700",
                    formField: "mb-4",
                  },
                  layout: {
                    socialButtonsPlacement: "top",
                    socialButtonsVariant: "blockButton",
                    shimmer: true,
                  },
                  variables: {
                    borderRadius: "8px",
                    spacingUnit: "4px",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


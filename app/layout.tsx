import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"], // Including Black (900) for headings
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Surveys - Modern Form & Survey Platform",
  description:
    "Create beautiful forms and surveys with our modern, intuitive platform. Collect responses, analyze data, and export insights seamlessly.",
  generator: "Surveys Platform",
  keywords: ["forms", "surveys", "data collection", "analytics", "form builder"],
  authors: [{ name: "Dewan Mukto Co." }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ec4899",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background font-body custom-scrollbar">
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@iconify/react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="solar:document-text-bold-duotone" className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-heading font-black text-foreground">Surveys</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium text-sm sm:text-base">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="font-medium text-sm sm:text-base">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-foreground mb-4 sm:mb-6 leading-tight">
            Create Beautiful
            <span className="text-primary block mt-2">Forms & Surveys</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
            Build professional forms and surveys with our modern, intuitive platform. Collect responses, analyze data,
            and export insights seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 font-semibold w-full sm:w-auto min-w-[200px] transition-all hover:scale-105"
              >
                <Icon icon="solar:rocket-bold-duotone" className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 font-semibold glass bg-transparent w-full sm:w-auto min-w-[200px] transition-all hover:scale-105"
              >
                <Icon icon="solar:play-circle-bold-duotone" className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <Card className="glass text-center p-4 sm:p-6 transition-all hover:scale-105 hover:shadow-xl">
            <CardHeader className="pb-4">
              <Icon
                icon="solar:widget-add-bold-duotone"
                className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4 transition-transform hover:rotate-12"
              />
              <CardTitle className="font-heading font-bold text-lg sm:text-xl">Drag & Drop Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Create forms effortlessly with our intuitive drag-and-drop interface. No coding required.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass text-center p-4 sm:p-6 transition-all hover:scale-105 hover:shadow-xl">
            <CardHeader className="pb-4">
              <Icon
                icon="solar:chart-square-bold-duotone"
                className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4 transition-transform hover:rotate-12"
              />
              <CardTitle className="font-heading font-bold text-lg sm:text-xl">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Track responses in real-time with beautiful charts and insights. Export data in multiple formats.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass text-center p-4 sm:p-6 transition-all hover:scale-105 hover:shadow-xl">
            <CardHeader className="pb-4">
              <Icon
                icon="solar:shield-check-bold-duotone"
                className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4 transition-transform hover:rotate-12"
              />
              <CardTitle className="font-heading font-bold text-lg sm:text-xl">Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Enterprise-grade security with reliable data storage. Your data is always safe and accessible.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Everything You Need to Create Amazing Forms
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to create, share, and analyze forms like a pro.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: "solar:text-field-bold-duotone", title: "Text Fields", desc: "Short & long text inputs" },
              { icon: "solar:list-arrow-down-bold-duotone", title: "Dropdowns", desc: "Single choice selections" },
              { icon: "solar:record-circle-bold-duotone", title: "Multiple Choice", desc: "Radio button options" },
              { icon: "solar:check-square-bold-duotone", title: "Checkboxes", desc: "Multiple selections" },
              { icon: "solar:calendar-bold-duotone", title: "Date Picker", desc: "Date & time inputs" },
              { icon: "solar:upload-bold-duotone", title: "File Upload", desc: "Document attachments" },
              { icon: "solar:download-bold-duotone", title: "CSV Export", desc: "Download responses" },
              { icon: "solar:share-bold-duotone", title: "Easy Sharing", desc: "Share with anyone" },
            ].map((feature, index) => (
              <Card key={index} className="glass p-4 text-center transition-all hover:scale-105 hover:shadow-lg">
                <Icon icon={feature.icon} className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-2 sm:mb-3" />
                <h4 className="font-heading font-semibold text-sm sm:text-base mb-1">{feature.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-strong border-t mt-16 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon icon="solar:document-text-bold-duotone" className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold text-foreground">Surveys</span>
            </div>
            <p className="text-muted-foreground text-sm text-center sm:text-right">© 2025 Dewan Mukto Co.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

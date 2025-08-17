import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function HomeTest() {
  return (
    <MainLayout>
      <div className="relative overflow-hidden bg-gradient-to-b from-background via-muted/50 to-background min-h-screen">
        {/* Background blur effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-primary/10 blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen text-center">
          {/* New Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-8">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              New
            </span>
            AI-powered website optimization
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 max-w-4xl">
            Optimize Your Website with AI Support
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Transform your website performance with intelligent optimization. 
            Boost speed, improve user experience, and increase conversions automatically.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              size="lg"
            >
              Start Free Trial
            </Button>

            <Button
              variant="outline"
              className="border-border hover:border-primary/50 hover:bg-muted text-foreground px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300 hover:scale-[1.02]"
              size="lg"
            >
              Book a Demo
            </Button>
          </div>

          {/* Trial features */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No credit card
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              14-day trial
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Brain,
  Shield,
  Stethoscope,
  MessageSquare,
  FileText,
  Search,
  Check,
  Star,
  ArrowRight,
  Pill,
  AlertCircle,
  Dumbbell,
  Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-primary/5 pt-16 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] opacity-20"></div>
        <div className="container px-4 md:px-6 flex flex-col items-center space-y-10 text-center relative z-10 py-20">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              AI-Powered Healthcare Assistant
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-primary/80">
              Your AI-Powered Medical Assistant
            </h1>
            <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl lg:text-2xl">
              Get instant access to reliable medical information, backed by
              trusted sources like MedlinePlus and PubMed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">24/7 Availability</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">
                  Evidence-Based Information
                </span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">
                  Personalized Guidance
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button
              size="lg"
              onClick={() => navigate("/chat")}
              className="w-full text-lg gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all"
            >
              Try Now <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const featuresSection = document.getElementById("features");
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full text-lg border-primary/20 hover:bg-primary/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-primary/5 border-y border-primary/10">
        <div className="container px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" fill="currentColor" />
              <Star className="h-5 w-5 text-primary" fill="currentColor" />
              <Star className="h-5 w-5 text-primary" fill="currentColor" />
              <Star className="h-5 w-5 text-primary" fill="currentColor" />
              <Star className="h-5 w-5 text-primary" fill="currentColor" />
              <span className="text-sm font-medium ml-2">
                4.9/5 from 2,000+ users
              </span>
            </div>
            <div className="flex items-center gap-2 border-l border-primary/20 pl-6">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                Trusted by healthcare professionals
              </span>
            </div>
            <div className="flex items-center gap-2 border-l border-primary/20 pl-6">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                Verified medical information
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Powerful Features for Your Health Needs
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Our AI assistant combines cutting-edge technology with trusted
              medical sources to provide you with accurate and helpful
              information.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center justify-center p-1 rounded-full bg-muted/30 border border-border mb-8">
              <Button
                variant="ghost"
                className="rounded-full px-6 py-1.5 text-sm font-medium"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                For Individuals
              </Button>
              <Button
                className="rounded-full px-6 py-1.5 text-sm font-medium bg-primary"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                For Healthcare Providers
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              className="bg-card/50 backdrop-blur-sm border border-blue-500/30 hover:border-blue-500/50 transition-all hover:shadow-lg overflow-hidden group cursor-pointer"
              onClick={() => navigate("/chat/medical")}
            >
              <div className="h-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20"></div>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Pill className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Medical Assistant</h3>
                <p className="text-muted-foreground">
                  Get reliable medical information and advice from trusted
                  sources like MedlinePlus and PubMed.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/chat/medical");
                  }}
                >
                  View Medical Assistant
                </Button>
              </CardContent>
            </Card>

            <Card
              className="bg-card/50 backdrop-blur-sm border border-red-500/30 hover:border-red-500/50 transition-all hover:shadow-lg overflow-hidden group cursor-pointer"
              onClick={() => navigate("/first-aid")}
            >
              <div className="h-2 bg-gradient-to-r from-red-500/20 to-red-600/20"></div>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold">First Aid Support</h3>
                <p className="text-muted-foreground">
                  Emergency first aid instructions and guidance for urgent
                  situations when every second counts.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/first-aid");
                  }}
                >
                  View First Aid Guides
                </Button>
              </CardContent>
            </Card>

            <Card
              className="bg-card/50 backdrop-blur-sm border border-green-500/30 hover:border-green-500/50 transition-all hover:shadow-lg overflow-hidden group cursor-pointer"
              onClick={() => navigate("/chat/fitness")}
            >
              <div className="h-2 bg-gradient-to-r from-green-500/20 to-green-600/20"></div>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <Dumbbell className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Fitness & Nutrition</h3>
                <p className="text-muted-foreground">
                  Personalized workout plans and dietary advice tailored to your
                  specific health goals and needs.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/chat/fitness");
                  }}
                >
                  View Fitness & Nutrition
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 bg-primary/5 border-y border-primary/10"
      >
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Our platform is designed to be intuitive and easy to use,
              providing you with accurate medical information in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/40 to-primary/40 z-0"></div>

            <div className="relative z-10">
              <div className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6 h-full flex flex-col items-center text-center space-y-4 hover:shadow-lg transition-all">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold">Ask a Question</h3>
                <p className="text-muted-foreground">
                  Type your health-related question in natural language through
                  our intuitive chat interface.
                </p>
                <div className="mt-auto pt-4">
                  <Search className="w-10 h-10 text-primary/60" />
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6 h-full flex flex-col items-center text-center space-y-4 hover:shadow-lg transition-all">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold">AI Processing</h3>
                <p className="text-muted-foreground">
                  Our AI searches medical databases, research papers, and your
                  uploaded documents for relevant information.
                </p>
                <div className="mt-auto pt-4">
                  <Brain className="w-10 h-10 text-primary/60" />
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6 h-full flex flex-col items-center text-center space-y-4 hover:shadow-lg transition-all">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold">Get Answers</h3>
                <p className="text-muted-foreground">
                  Receive accurate information with sources and references,
                  presented in an easy-to-understand format.
                </p>
                <div className="mt-auto pt-4">
                  <MessageSquare className="w-10 h-10 text-primary/60" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              onClick={() => navigate("/chat")}
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all"
            >
              Try It Now
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
                About Us
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About MedAssist AI
              </h2>
              <p className="text-muted-foreground md:text-lg">
                We're committed to making reliable medical information
                accessible to everyone. Our AI assistant combines cutting-edge
                technology with trusted medical sources to provide accurate and
                helpful information.
              </p>
              <p className="text-muted-foreground md:text-lg">
                Founded by a team of healthcare professionals and AI experts,
                MedAssist AI aims to bridge the gap between medical knowledge
                and everyday users, making healthcare information more
                accessible and understandable.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Privacy First</h4>
                    <p className="text-sm text-muted-foreground">
                      Your health data stays private and secure
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">AI-Powered</h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced technology for accurate information
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Medical Expertise</h4>
                    <p className="text-sm text-muted-foreground">
                      Developed with healthcare professionals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Global Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Available 24/7 from anywhere in the world
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/signup")}
                  className="border-primary/20 hover:bg-primary/10"
                >
                  Join Our Community
                </Button>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/40 rounded-lg blur-lg opacity-50"></div>
              <div className="relative bg-card/80 backdrop-blur-sm rounded-lg overflow-hidden border border-primary/20 shadow-xl p-8">
                <div className="flex flex-col gap-6">
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                  <p className="text-muted-foreground">
                    At MedAssist AI, we believe that everyone deserves access to
                    reliable medical information. Our platform combines advanced
                    AI technology with trusted medical sources to provide
                    accurate and helpful guidance when you need it most.
                  </p>
                  <p className="text-muted-foreground">
                    Whether you're looking for information about symptoms,
                    treatments, or preventive care, our AI assistant is here to
                    help you make informed decisions about your health.
                  </p>

                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <h4 className="font-semibold mb-2">Trusted By</h4>
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="bg-muted/30 px-4 py-2 rounded-md text-sm font-medium">
                        Medical University
                      </div>
                      <div className="bg-muted/30 px-4 py-2 rounded-md text-sm font-medium">
                        Health Clinics
                      </div>
                      <div className="bg-muted/30 px-4 py-2 rounded-md text-sm font-medium">
                        Research Institutes
                      </div>
                      <div className="bg-muted/30 px-4 py-2 rounded-md text-sm font-medium">
                        +500 Healthcare Providers
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y border-primary/10">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">10k+</h3>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">500+</h3>
              <p className="text-sm text-muted-foreground">
                Healthcare Providers
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">24/7</h3>
              <p className="text-sm text-muted-foreground">Availability</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">99%</h3>
              <p className="text-sm text-muted-foreground">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10 border-t border-primary/20">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Join thousands of users who trust MedAssist AI for reliable
              medical information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 transition-all"
              >
                Sign Up Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/chat")}
                className="border-primary/20 hover:bg-primary/10"
              >
                Try Demo
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-primary/20 flex flex-col md:flex-row justify-center items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Have questions? Contact our support team
              </p>
              <Button
                variant="link"
                className="text-primary"
                onClick={() =>
                  (window.location.href = "mailto:support@medassist.ai")
                }
              >
                support@medassist.ai
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

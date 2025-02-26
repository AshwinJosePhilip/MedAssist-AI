import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bot, Brain, Shield, Stethoscope } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted pt-16">
        <div className="container px-4 md:px-6 flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Your AI-Powered Medical Assistant
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Get instant access to reliable medical information, backed by
              trusted sources like MedlinePlus and PubMed.
            </p>
          </div>
          <div className="space-x-4">
            <Button size="lg" onClick={() => navigate("/chat")}>
              Try Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/#features")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
              <Bot className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-semibold">AI Chat Assistant</h3>
              <p className="text-center text-muted-foreground">
                24/7 access to medical information through natural conversations
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
              <Brain className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-semibold">Smart RAG System</h3>
              <p className="text-center text-muted-foreground">
                Combines AI with verified medical sources for accurate responses
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
              <Shield className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-semibold">Secure & Private</h3>
              <p className="text-center text-muted-foreground">
                Your health information is protected and encrypted
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
              <Stethoscope className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-semibold">Medical Resources</h3>
              <p className="text-center text-muted-foreground">
                Access to trusted medical databases and research papers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Ask a Question</h3>
              <p className="text-muted-foreground">
                Type your health-related question in natural language
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold">AI Processing</h3>
              <p className="text-muted-foreground">
                Our AI searches medical databases and research papers
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold">Get Answers</h3>
              <p className="text-muted-foreground">
                Receive accurate information with sources and references
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter mb-4">
            About MedAssist AI
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            We're committed to making reliable medical information accessible to
            everyone. Our AI assistant combines cutting-edge technology with
            trusted medical sources to provide accurate and helpful information.
          </p>
        </div>
      </section>
    </div>
  );
}

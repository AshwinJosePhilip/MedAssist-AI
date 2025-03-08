import {
  Twitter,
  Github,
  Heart,
  Mail,
  Globe,
  Shield,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm relative z-10">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 md:max-w-xs">
            <div className="flex items-center gap-2">
              <span className="text-primary text-2xl">🧠</span>
              <h3 className="text-xl font-bold">MedAssist AI</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Providing reliable medical information powered by AI and backed by
              trusted medical sources. Your health companion available 24/7.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <Mail className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <Globe className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-primary">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="/#about"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Heart className="h-3.5 w-3.5" />
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/#contact"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-primary">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://medlineplus.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    MedlinePlus
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ncbi.nlm.nih.gov/pubmed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    PubMed
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-primary">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2024 MedAssist AI. All rights reserved. Made with{" "}
            <Heart className="h-3 w-3 text-destructive fill-destructive" /> for
            better healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
}

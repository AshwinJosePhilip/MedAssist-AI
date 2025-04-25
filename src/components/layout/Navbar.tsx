import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  X,
  MessageSquare,
  FileText,
  User,
  LogOut,
  Home,
  FileDigit,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2"
          >
            <span className="text-primary text-2xl">🧠</span> MedAssist AI
          </a>
          <div className="hidden md:flex gap-6">
            <a
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="/first-aid"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              First Aid
            </a>
            <a
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </a>
            <a
              href="/#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-colors"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={
                        user.user_metadata.avatar_url ||
                        `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.email}`
                      }
                      alt={user.user_metadata.full_name || user.email}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {(user.user_metadata.full_name || user.email)
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem
                  onClick={() => navigate("/chat")}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat Assistant
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/chat/history")}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat History
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/documents")}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Documents
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate("/documents?tab=upload&summarize=true")
                  }
                  className="cursor-pointer flex items-center gap-2"
                >
                  <FileDigit className="h-4 w-4" />
                  Summarize Medical PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer flex items-center gap-2 text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="hover:bg-primary/10"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur">
          <div className="space-y-1 px-4 py-3">
            <a
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </a>
            <a
              href="/#features"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="/first-aid"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              First Aid
            </a>
            <a
              href="/#how-it-works"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </a>
            <a
              href="/#about"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>

            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/chat");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat Assistant
                </button>
                <button
                  onClick={() => {
                    navigate("/chat/history");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat History
                </button>
                <button
                  onClick={() => {
                    navigate("/documents");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10"
                >
                  <FileText className="h-4 w-4" />
                  Documents
                </button>
                <button
                  onClick={() => {
                    navigate("/documents?tab=upload&summarize=true");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10"
                >
                  <FileDigit className="h-4 w-4" />
                  Summarize Medical PDF
                </button>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary/10"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

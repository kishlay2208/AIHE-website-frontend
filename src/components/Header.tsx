import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import AuthDialog from "@/components/AuthDialog";
import iskconLogo from "@/assets/iskcon-logo.png";
import aiheLogo from "@/assets/aihe-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Transition after scrolling past hero section (approximately 100vh)
      setIsScrolled(window.scrollY > window.innerHeight * 0.1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Our Inspiration", href: "#inspiration" },
    { name: "Courses", href: "#courses" },
    { name: "Our Faculty", href: "#instructors" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-primary shadow-lg" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Dual Logos */}
            <a href="#home" className="flex items-center gap-3">
              <img 
                src={iskconLogo} 
                alt="ISKCON Ujjain" 
                className="h-10 md:h-12 w-auto"
              />
              <div className="w-px h-8 bg-primary-foreground/30" />
              <img 
                src={aiheLogo} 
                alt="AIHE" 
                className="h-10 md:h-12 w-auto"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`transition-colors duration-300 text-sm font-medium ${
                    isScrolled 
                      ? "text-primary-foreground/90 hover:text-primary-foreground" 
                      : "text-primary-foreground/90 hover:text-primary-foreground"
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant={isScrolled ? "secondary" : "outline"}
                size="sm"
                className={`hidden md:flex ${!isScrolled ? "border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10" : ""}`}
                onClick={handleLoginClick}
              >
                <User className="w-4 h-4" />
                {isLoggedIn ? "Dashboard" : "Login"}
              </Button>

              {/* Mobile Menu Button */}
              <button
                className={`lg:hidden p-2 ${isScrolled ? "text-primary-foreground" : "text-primary-foreground"}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-primary border-t border-primary-foreground/20"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-primary-foreground/90 hover:text-primary-foreground transition-colors py-2 text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLoginClick();
                  }}
                >
                  <User className="w-4 h-4" />
                  {isLoggedIn ? "Go to Dashboard" : "Login"}
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </>
  );
};

export default Header;

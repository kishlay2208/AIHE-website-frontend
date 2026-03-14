import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const { login, register, googleLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if Google OAuth script is loaded
  useEffect(() => {
    const checkGoogle = () => {
      if (typeof window !== "undefined" && (window as any).google) {
        setGoogleReady(true);
      } else {
        // Retry after a short delay
        setTimeout(checkGoogle, 100);
      }
    };
    checkGoogle();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onOpenChange(false);
      setEmail("");
      setPassword("");
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      // Navigate immediately after successful login
      // Use setTimeout to allow React state to propagate
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.response?.data?.detail || "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({
        title: "Validation error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    try {
      await register(name, email, password);
      onOpenChange(false);
      setName("");
      setEmail("");
      setPassword("");
      toast({
        title: "Account created",
        description: "Welcome! Your account has been created successfully.",
      });
      // Navigate immediately after successful signup
      // Use setTimeout to allow React state to propagate
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error?.response?.data?.detail || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = () => {
    const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      toast({
        title: "Google OAuth not configured",
        description: "VITE_GOOGLE_CLIENT_ID is missing in .env file",
        variant: "destructive",
      });
      return;
    }

    if (!clientId.includes(".apps.googleusercontent.com")) {
      toast({
        title: "Invalid Google Client ID",
        description: "Client ID must end with .apps.googleusercontent.com. Check your .env file.",
        variant: "destructive",
      });
      return;
    }

    if (!googleReady || typeof window === "undefined" || !(window as any).google) {
      toast({
        title: "Google OAuth not ready",
        description: "Google OAuth script is still loading. Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile",
        callback: async (response: any) => {
          if (response.access_token) {
            try {
              await googleLogin(response.access_token);
              onOpenChange(false);
              toast({
                title: "Login successful",
                description: "Welcome!",
              });
              // Navigate immediately after successful Google login
              // Use setTimeout to allow React state to propagate
              setTimeout(() => {
                navigate("/dashboard", { replace: true });
              }, 100);
            } catch (error: any) {
              toast({
                title: "Google login failed",
                description: error?.response?.data?.detail || "Failed to authenticate with Google",
                variant: "destructive",
              });
            }
          }
        },
      }).requestAccessToken();
    } catch (error: any) {
      toast({
        title: "Google OAuth error",
        description: error?.message || "Failed to initialize Google OAuth",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <p className="text-muted-foreground text-center text-sm">
            {isLogin
              ? "Please enter your details to login"
              : "Join us on this spiritual journey"}
          </p>
        </DialogHeader>

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4 py-4">
          {isLogin ? (
            // Login Form
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember for 30 days</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            </>
          ) : (
            // Signup Form
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signupPassword"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          )}

          <Button type="submit" variant="default" className="w-full" size="lg">
            {isLogin ? "Login" : "Sign Up"}
          </Button>

          <div className="relative">
            <Separator className="my-4" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-muted-foreground text-xs">
              OR
            </span>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button 
              type="button"
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-primary hover:underline font-medium"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquare, TrendingUp, Shield, Zap } from "lucide-react";
import heroImage from "@assets/stock_images/modern_financial_tec_ac3f5751.jpg";

interface AuthPageProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string, role: "external_client" | "operations_team") => void;
}

export default function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"external_client" | "operations_team">("external_client");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted:", { loginUsername });
    onLogin(loginUsername, loginPassword);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    console.log("Register attempted:", { registerUsername, role });
    onRegister(registerUsername, registerPassword, role);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Financial workspace" 
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">BBH MakerChat</h1>
            </div>
            <p className="text-lg text-white/90 ml-13">Enterprise Financial Services Platform</p>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Intelligent Financial<br />Operations Assistant
              </h2>
              <p className="text-lg text-white/90 max-w-md">
                Streamline your financial workflows with AI-powered insights for trades, settlements, compliance, and portfolio analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-md">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Real-time Analytics</h3>
                  <p className="text-sm text-white/80">Instant insights into portfolio performance and trade operations</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Compliance Ready</h3>
                  <p className="text-sm text-white/80">Built-in compliance checks and audit trail capabilities</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Instant Responses</h3>
                  <p className="text-sm text-white/80">Natural language queries across 8 financial service categories</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/60">
            © 2025 BBH MakerChat. Enterprise Financial Platform.
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">BBH MakerChat</h1>
            </div>
            <p className="text-sm text-muted-foreground">Enterprise Financial Services Platform</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account or create a new one</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" data-testid="tab-login" className="text-base">Sign In</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register" className="text-base">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    data-testid="input-login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    data-testid="input-login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-11" size="lg" data-testid="button-login">
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    data-testid="input-register-username"
                    type="text"
                    placeholder="Choose a username"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    data-testid="input-register-password"
                    type="password"
                    placeholder="Create a password (min 8 characters)"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    data-testid="input-confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label>Account Type</Label>
                  <RadioGroup value={role} onValueChange={(value) => setRole(value as "external_client" | "operations_team")} className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate cursor-pointer">
                      <RadioGroupItem value="external_client" id="register-client" data-testid="radio-register-client" />
                      <Label htmlFor="register-client" className="font-normal cursor-pointer flex-1">
                        <div className="font-medium">External Client</div>
                        <div className="text-xs text-muted-foreground">For client-facing users</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate cursor-pointer">
                      <RadioGroupItem value="operations_team" id="register-ops" data-testid="radio-register-ops" />
                      <Label htmlFor="register-ops" className="font-normal cursor-pointer flex-1">
                        <div className="font-medium">Operations Team</div>
                        <div className="text-xs text-muted-foreground">For internal operations staff</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full h-11" size="lg" data-testid="button-register">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Secure enterprise-grade authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
}

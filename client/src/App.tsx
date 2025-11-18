import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import AuthPage from "@/components/AuthPage";
import ChatPage from "@/pages/ChatPage";
import { api } from "@/lib/api";
import type { User } from "@shared/schema";

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's an existing session
    api
      .getSession()
      .then((data) => {
        setCurrentUser(data.user);
      })
      .catch(() => {
        // No active session
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogin = async (username: string, password: string, role: string) => {
    try {
      const data = await api.login(username, password);
      setCurrentUser(data.user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (username: string, password: string, role: string) => {
    try {
      const data = await api.register(username, password, role);
      setCurrentUser(data.user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.user.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setCurrentUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!currentUser ? (
        <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <ChatPage
          username={currentUser.username}
          role={currentUser.role}
          onLogout={handleLogout}
        />
      )}
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

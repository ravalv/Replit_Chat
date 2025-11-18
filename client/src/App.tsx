import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthPage from "@/components/AuthPage";
import ChatPage from "@/pages/ChatPage";

// todo: remove mock functionality
const mockUsers = [
  { username: "client1", password: "password", role: "external_client" },
  { username: "ops1", password: "password", role: "operations_team" },
];

function App() {
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    role: string;
  } | null>(null);

  const handleLogin = (username: string, password: string, role: string) => {
    // Mock authentication
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser({ username, role });
      console.log("Login successful:", { username, role });
    } else {
      console.log("Login failed");
    }
  };

  const handleRegister = (username: string, password: string, role: string) => {
    // Mock registration
    mockUsers.push({ username, password, role: role as any });
    setCurrentUser({ username, role });
    console.log("Registration successful:", { username, role });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    console.log("Logged out");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

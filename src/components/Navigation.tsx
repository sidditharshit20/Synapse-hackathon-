import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Train, Home, Phone, LogOut, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

interface NavigationProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
  userName?: string;
}

const Navigation = ({ isAuthenticated = false, onLogout, userName }: NavigationProps) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <nav className="bg-surface border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Train className="h-8 w-8 text-blue-accent" />
            <span className="text-xl font-bold text-foreground">RailSchedule</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "default" : "ghost"} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            
            {isAuthenticated && (
              <Link to="/schedule">
                <Button 
                  variant={isActive("/schedule") ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Train className="h-4 w-4" />
                  <span>Train Schedule</span>
                </Button>
              </Link>
            )}
            
            <Link to="/contact">
              <Button 
                variant={isActive("/contact") ? "default" : "ghost"} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {userName}!
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
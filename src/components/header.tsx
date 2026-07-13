import { Link } from 'react-router-dom';
import { Heart, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/use-auth';
import { ModeToggle } from './mode-toggle';

export function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between w-full px-4">
          {/* Logo à gauche */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary-foreground" />
            <span className="font-playfair text-xl font-semibold">Daily Tips</span>
          </Link>

          {/* Liens centrés */}
          <div className="flex items-center space-x-6 mx-auto">
            <Link to="/" className="text-sm font-medium hover:text-primary-foreground transition-colors">
              Home
            </Link>
            <Link to="/articles" className="text-sm font-medium hover:text-primary-foreground transition-colors">
              Articles
            </Link>
            <Link to="/categories" className="text-sm font-medium hover:text-primary-foreground transition-colors">
              Categories
            </Link>
          </div>

          {/* Boutons à droite */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  {user?.name}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>

                <Link to="/auth">
                  <Button variant="default" size="sm">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
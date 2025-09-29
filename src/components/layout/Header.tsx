import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <Rocket className="h-6 w-6 text-primary" />
          <span>OrbitBill</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle className="relative top-0 right-0" />
          <Button variant="ghost" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild className="transition-all duration-300 hover:shadow-primary hover:-translate-y-px">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
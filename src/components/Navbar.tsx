import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <Link to="/" className="font-display text-xl font-bold text-foreground">
          La Cucina Bella
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/orders"
                className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                <ShoppingBag size={16} />
                Orders
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <User size={16} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

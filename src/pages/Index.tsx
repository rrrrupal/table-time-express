import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import MenuItemCard from "@/components/MenuItemCard";
import CartPanel from "@/components/CartPanel";
import OrderConfirmation from "@/components/OrderConfirmation";
import { useCart } from "@/hooks/useCart";
import { categories, menuItems } from "@/data/menu";
import { toast } from "sonner";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const cart = useCart();

  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? menuItems
        : menuItems.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  const handleAddItem = (item: typeof menuItems[0]) => {
    cart.addItem(item);
    toast.success(`${item.name} added to cart`, { duration: 1500 });
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setOrderConfirmed(true);
  };

  const handleOrderClose = () => {
    setOrderConfirmed(false);
    cart.clearCart();
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <HeroSection />

      <main id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Our Menu
        </h2>
        <p className="font-body text-muted-foreground mb-6">
          Handcrafted dishes made with love and the finest ingredients
        </p>

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onAdd={handleAddItem} />
            ))}
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-secondary/50 border-t border-border py-8 text-center">
        <p className="font-display text-xl font-semibold text-foreground">La Cucina Bella</p>
        <p className="font-body text-sm text-muted-foreground mt-1">
          © 2026 All rights reserved • Made with ❤️
        </p>
      </footer>

      <CartPanel
        items={cart.items}
        total={cart.total}
        itemCount={cart.itemCount}
        isOpen={cartOpen}
        onToggle={() => setCartOpen((o) => !o)}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        onCheckout={handleCheckout}
      />

      {orderConfirmed && (
        <OrderConfirmation
          total={cart.total + 3.99}
          onClose={handleOrderClose}
        />
      )}
    </div>
  );
};

export default Index;

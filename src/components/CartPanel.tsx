import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/types/menu";

interface CartPanelProps {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  isLoading?: boolean;
}
}

const CartPanel = ({
  items,
  total,
  itemCount,
  isOpen,
  onToggle,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartPanelProps) => {
  return (
    <>
      {/* Floating cart button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <ShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground w-6 h-6 rounded-full text-xs font-body font-bold flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Slide-in panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-2xl font-bold text-foreground">Your Order</h2>
              <button
                onClick={onToggle}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground font-body">
                <ShoppingCart size={48} className="mb-4 opacity-30" />
                <p>Your cart is empty</p>
                <p className="text-sm mt-1">Add items from the menu</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="flex gap-4 bg-secondary/50 rounded-xl p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body font-semibold text-foreground truncate">
                          {item.name}
                        </h4>
                        <p className="font-display font-bold text-primary mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-body font-semibold text-foreground w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => onRemove(item.id)}
                            className="ml-auto text-destructive hover:opacity-70 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-semibold text-foreground">$3.99</span>
                  </div>
                  <div className="flex justify-between font-display text-xl font-bold border-t border-border pt-4">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">${(total + 3.99).toFixed(2)}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onCheckout}
                    className="w-full py-4 rounded-full bg-primary text-primary-foreground font-body font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
                  >
                    Place Order
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartPanel;

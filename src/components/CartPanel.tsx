import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Minus, Plus, Trash2, MapPin, CreditCard, Banknote, Wallet } from "lucide-react";
import { CartItem } from "@/types/menu";
import CardDetailsForm, { CardDetails } from "./CardDetailsForm";
import {
  isValidCardNumber,
  isValidExpiry,
  isValidCvv,
  isValidCardholderName,
} from "@/lib/cardValidation";

export type PaymentMethod = "card" | "cash" | "wallet";

export interface CheckoutPayload {
  address: string;
  paymentMethod: PaymentMethod;
  card?: { last4: string; brand: string };
}

interface CartPanelProps {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: (payload: CheckoutPayload) => void;
  isLoading?: boolean;
}

const paymentOptions: { id: PaymentMethod; label: string; icon: typeof CreditCard; desc: string }[] = [
  { id: "card", label: "Card", icon: CreditCard, desc: "Credit / Debit card" },
  { id: "cash", label: "Cash", icon: Banknote, desc: "Cash on delivery" },
  { id: "wallet", label: "Wallet", icon: Wallet, desc: "Digital wallet" },
];

const CartPanel = ({
  items,
  total,
  itemCount,
  isOpen,
  onToggle,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  isLoading,
}: CartPanelProps) => {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState<CardDetails>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    brand: "unknown",
  });
  const [errors, setErrors] = useState<{
    address?: string;
    card?: Partial<Record<keyof CardDetails, string>>;
  }>({});

  const handleCheckout = () => {
    const newErrors: typeof errors = {};
    const trimmed = address.trim();

    if (!trimmed) {
      newErrors.address = "Please enter a delivery address";
    } else if (trimmed.length < 10) {
      newErrors.address = "Please enter a complete address";
    }

    if (paymentMethod === "card") {
      const cardErrors: Partial<Record<keyof CardDetails, string>> = {};
      if (!card.number.trim()) {
        cardErrors.number = "Card number is required";
      } else if (!isValidCardNumber(card.number)) {
        cardErrors.number = "Invalid card number";
      }
      if (!isValidCardholderName(card.name)) {
        cardErrors.name = "Enter the name on the card";
      }
      if (!card.expiry.trim()) {
        cardErrors.expiry = "Required";
      } else if (!isValidExpiry(card.expiry)) {
        cardErrors.expiry = "Invalid or expired";
      }
      if (!card.cvv.trim()) {
        cardErrors.cvv = "Required";
      } else if (!isValidCvv(card.cvv, card.brand)) {
        cardErrors.cvv = `Must be ${card.brand === "amex" ? 4 : 3} digits`;
      }
      if (Object.keys(cardErrors).length > 0) {
        newErrors.card = cardErrors;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onCheckout({
      address: trimmed,
      paymentMethod,
      card:
        paymentMethod === "card"
          ? {
              last4: card.number.replace(/\s/g, "").slice(-4),
              brand: card.brand,
            }
          : undefined,
    });
  };

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
                  {/* Cart items */}
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

                  {/* Delivery address */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 font-body font-semibold text-foreground text-sm mb-2">
                      <MapPin size={16} className="text-primary" />
                      Delivery Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                      }}
                      placeholder="Enter your full delivery address..."
                      rows={2}
                      maxLength={300}
                      className={`w-full px-4 py-3 rounded-xl bg-secondary border font-body text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                        errors.address ? "border-destructive" : "border-border"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-destructive text-xs font-body mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Payment method */}
                  <div>
                    <label className="flex items-center gap-2 font-body font-semibold text-foreground text-sm mb-2">
                      <CreditCard size={16} className="text-primary" />
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {paymentOptions.map((opt) => {
                        const Icon = opt.icon;
                        const selected = paymentMethod === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPaymentMethod(opt.id)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all font-body text-xs ${
                              selected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-secondary text-muted-foreground hover:border-primary/40"
                            }`}
                          >
                            <Icon size={20} />
                            <span className="font-semibold">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-muted-foreground text-xs font-body mt-1.5">
                      {paymentOptions.find((o) => o.id === paymentMethod)?.desc}
                    </p>
                  </div>

                  {/* Card details (only when card selected) */}
                  <AnimatePresence initial={false}>
                    {paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <CardDetailsForm
                          value={card}
                          onChange={(c) => {
                            setCard(c);
                            if (errors.card) setErrors((prev) => ({ ...prev, card: undefined }));
                          }}
                          errors={errors.card ?? {}}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full py-4 rounded-full bg-primary text-primary-foreground font-body font-bold text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isLoading ? "Placing order..." : "Place Order"}
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

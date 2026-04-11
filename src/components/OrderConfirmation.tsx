import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface OrderConfirmationProps {
  total: number;
  onClose: () => void;
}

const OrderConfirmation = ({ total, onClose }: OrderConfirmationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-background rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <CheckCircle size={80} className="text-primary mx-auto mb-6" />
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-2">
          Order Confirmed!
        </h2>
        <p className="font-body text-muted-foreground mb-2">
          Your delicious meal is being prepared
        </p>
        <p className="font-display text-2xl font-bold text-primary mb-6">
          ${total.toFixed(2)}
        </p>
        <p className="font-body text-sm text-muted-foreground mb-8">
          Estimated delivery: 30-45 minutes
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-primary text-primary-foreground font-body font-bold text-lg hover:opacity-90 transition-opacity"
        >
          Back to Menu
        </button>
      </motion.div>
    </motion.div>
  );
};

export default OrderConfirmation;

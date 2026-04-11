import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { MenuItem } from "@/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onAdd }: MenuItemCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.popular && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-body font-semibold px-3 py-1 rounded-full">
            🔥 Popular
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-card-foreground">{item.name}</h3>
        <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-display text-xl font-bold text-primary">
            ${item.price.toFixed(2)}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onAdd(item)}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-full font-body font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;

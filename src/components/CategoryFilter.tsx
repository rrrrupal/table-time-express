import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: { id: string; label: string; icon: string }[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto py-4 px-1 scrollbar-hide">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-medium text-sm whitespace-nowrap transition-colors ${
            activeCategory === cat.id
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <span className="text-lg">{cat.icon}</span>
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;

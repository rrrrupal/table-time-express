import { motion } from "framer-motion";
import heroImage from "@/assets/hero-food.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
      <img
        src={heroImage}
        alt="Beautifully arranged restaurant dishes"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1024}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-4"
        >
          La Cucina Bella
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-lg md:text-xl text-primary-foreground/80 max-w-lg"
        >
          Fresh ingredients, authentic flavors. Order your favorite dishes now.
        </motion.p>
        <motion.a
          href="#menu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 px-8 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold text-lg shadow-lg hover:opacity-90 transition-opacity"
        >
          View Menu
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;

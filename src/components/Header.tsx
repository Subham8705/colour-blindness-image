import { motion } from 'framer-motion';
import { Eye, Info, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onInfoClick: () => void;
}

const Header = ({ onInfoClick }: HeaderProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-panel px-6 py-5 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10"
        >
          <Eye className="w-6 h-6 text-primary" aria-hidden="true" />
        </motion.div>
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Color Blindness Simulator
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize color vision deficiencies
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-foreground" />
          )}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onInfoClick}
          className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Learn more about color blindness"
        >
          <Info className="w-5 h-5 text-foreground" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;

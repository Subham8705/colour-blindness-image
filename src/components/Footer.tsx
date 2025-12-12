import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-panel px-6 py-4"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span>Made by Subham</span>
          <span>for accessibility</span>
        </div>

        <motion.a
          whileHover={{ scale: 1.02 }}
          href="https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>WCAG Guidelines</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </motion.a>
      </div>
    </motion.footer>
  );
};

export default Footer;

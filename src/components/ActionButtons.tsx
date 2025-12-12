import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RotateCcw, ChevronDown, Split, Image as ImageIcon } from 'lucide-react';

interface ActionButtonsProps {
  onDownload: (type: 'full' | 'split') => void;
  onReset: () => void;
  canDownload: boolean;
  canReset: boolean;
}

const ActionButtons = ({ onDownload, onReset, canDownload, canReset }: ActionButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex gap-3">
      <div className="relative flex-1" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: canDownload ? 1.02 : 1 }}
          whileTap={{ scale: canDownload ? 0.98 : 1 }}
          onClick={() => canDownload && setIsOpen(!isOpen)}
          disabled={!canDownload}
          className={`w-full btn-primary flex items-center justify-between px-4 ${isOpen ? 'ring-2 ring-primary/50' : ''}`}
          aria-label="Download options"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            <span>Download</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute top-full left-0 right-0 mt-2 p-1 bg-popover border border-border rounded-xl shadow-xl z-50 flex flex-col gap-1"
            >
              <button
                onClick={() => {
                  onDownload('full');
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-muted text-left transition-colors group"
              >
                <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-medium block text-foreground">Result Only</span>
                  <span className="text-[10px] text-muted-foreground block">Full simulated image</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onDownload('split');
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-muted text-left transition-colors group"
              >
                <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Split className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-medium block text-foreground">Split View</span>
                  <span className="text-[10px] text-muted-foreground block">Original vs Simulated</span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: canReset ? 1.02 : 1 }}
        whileTap={{ scale: canReset ? 0.98 : 1 }}
        onClick={onReset}
        disabled={!canReset}
        className="btn-secondary"
        aria-label="Reset simulator"
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default ActionButtons;

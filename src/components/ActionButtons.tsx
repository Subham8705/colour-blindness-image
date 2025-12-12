import { motion } from 'framer-motion';
import { Download, RotateCcw } from 'lucide-react';

interface ActionButtonsProps {
  onDownload: () => void;
  onReset: () => void;
  canDownload: boolean;
  canReset: boolean;
}

const ActionButtons = ({ onDownload, onReset, canDownload, canReset }: ActionButtonsProps) => {
  return (
    <div className="flex gap-3">
      <motion.button
        whileHover={{ scale: canDownload ? 1.02 : 1 }}
        whileTap={{ scale: canDownload ? 0.98 : 1 }}
        onClick={onDownload}
        disabled={!canDownload}
        className="flex-1 btn-primary"
        aria-label="Download simulated image as PNG"
      >
        <Download className="w-5 h-5" />
        <span>Download</span>
      </motion.button>
      
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

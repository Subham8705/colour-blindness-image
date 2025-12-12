import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Loader2 } from 'lucide-react';

interface WebcamToggleProps {
  isActive: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const WebcamToggle = ({ isActive, onToggle, isLoading, error }: WebcamToggleProps) => {
  return (
    <div className="space-y-3">
      <motion.button
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        onClick={onToggle}
        disabled={isLoading}
        className={`w-full ${isActive ? 'btn-accent' : 'btn-secondary'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        aria-pressed={isActive}
        aria-label={isActive ? 'Turn off webcam' : 'Turn on webcam'}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Starting camera...</span>
          </>
        ) : isActive ? (
          <>
            <CameraOff className="w-5 h-5" />
            <span>Stop Webcam</span>
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            <span>Use Webcam</span>
          </>
        )}
      </motion.button>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-destructive/10 border border-destructive/20" 
            role="alert"
          >
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isActive && !error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground text-center"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Live camera feed active
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebcamToggle;

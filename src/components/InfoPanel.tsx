import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { SIMULATION_INFO, SimulationType } from '@/utils/colorTransforms';

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoPanel = ({ isOpen, onClose }: InfoPanelProps) => {
  const types: SimulationType[] = ['deuteranopia', 'protanopia', 'tritanopia', 'achromatopsia'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="info-title">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card rounded-2xl shadow-custom-xl border border-border"
          >
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 id="info-title" className="text-lg font-semibold text-foreground">
                About Color Blindness
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close information panel"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Introduction */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/15"
              >
                <div className="flex gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 h-fit">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Why This Matters</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Approximately 8% of men and 0.5% of women worldwide have some form of color vision deficiency. 
                      By simulating how your designs appear to these users, you can create more accessible and inclusive experiences.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Types of Color Blindness */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Types of Color Vision Deficiency
                </h3>
                
                {types.map((type, index) => {
                  const info = SIMULATION_INFO[type];
                  return (
                    <motion.div 
                      key={type}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                      className="p-5 rounded-xl border border-border bg-gradient-to-br from-secondary/30 to-transparent hover:border-border/80 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{info.name}</h4>
                        <span className="label-badge">
                          {info.prevalence}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{info.description}</p>
                      
                      {info.tips.length > 0 && (
                        <div className="space-y-2.5 pt-3 border-t border-border/50">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Design Tips
                          </p>
                          {info.tips.map((tip, tipIndex) => (
                            <div key={tipIndex} className="flex items-start gap-2.5">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground">{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* General Guidelines */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/15"
              >
                <div className="flex gap-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 h-fit">
                    <AlertCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">General Design Guidelines</h3>
                    <ul className="text-sm text-muted-foreground space-y-2.5">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        Never rely on color alone to convey information
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        Use patterns, icons, or text labels alongside colors
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        Ensure sufficient contrast ratios (WCAG 2.1 guidelines)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        Test your designs with colorblind users when possible
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        Consider using colorblind-safe palettes for charts and graphs
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;

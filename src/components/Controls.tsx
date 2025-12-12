import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { SimulationType, SIMULATION_INFO } from '@/utils/colorTransforms';

interface ControlsProps {
  simulationType: SimulationType;
  onSimulationChange: (type: SimulationType) => void;
  intensity: number;
  onIntensityChange: (value: number) => void;
  mode: 'simulate' | 'correct';
  onModeChange: (mode: 'simulate' | 'correct') => void;
}

const SIMULATION_TYPES: SimulationType[] = [
  'deuteranopia',
  'protanopia',
  'tritanopia',
  'achromatopsia',
];

const Controls = ({
  simulationType,
  onSimulationChange,
  intensity,
  onIntensityChange,
  mode,
  onModeChange,
}: ControlsProps) => {
  return (
    <div className="space-y-5">
      {/* Mode Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Mode
          </label>
          <div className="group relative">
            <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />

            {/* Tooltip */}
            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-popover border border-border rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-foreground">Simulate:</span>
                  <p className="text-muted-foreground">Shows how a color-blind person likely sees the image.</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Correct (Daltonization):</span>
                  <p className="text-muted-foreground">Shifts confusing colors to the visible spectrum.</p>
                  <p className="text-muted-foreground mt-1 italic border-l-2 border-primary/50 pl-2">
                    Example: For Protanopia (Red-blind), red pixels are shifted towards blue/pink to make them distinct from green.
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute right-1 bottom-[-4px] w-2 h-2 bg-popover border-r border-b border-border rotate-45 transform"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 bg-secondary/50 p-1 rounded-xl">
          <button
            onClick={() => onModeChange('simulate')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'simulate'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Simulate
          </button>
          <button
            onClick={() => onModeChange('correct')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'correct'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Corrected
          </button>
        </div>
      </div>
      {/* Simulation Mode Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Simulation Mode
        </label>
        <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Color blindness simulation type">
          {SIMULATION_TYPES.map((type, index) => (
            <motion.button
              key={type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              role="radio"
              aria-checked={simulationType === type}
              onClick={() => onSimulationChange(type)}
              className={`btn-simulation text-left ${simulationType === type ? 'active' : ''}`}
            >
              <span className="block text-sm font-medium">
                {SIMULATION_INFO[type].name}
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                {SIMULATION_INFO[type].prevalence}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Intensity Slider */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label htmlFor="intensity-slider" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Intensity
          </label>
          <motion.span
            key={intensity}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-mono text-primary font-semibold tabular-nums"
          >
            {intensity}%
          </motion.span>
        </div>
        <div className="pt-1">
          <input
            id="intensity-slider"
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => onIntensityChange(Number(e.target.value))}
            className="slider-custom"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={intensity}
            aria-valuetext={`${intensity}% intensity`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wide">
          <span>Original</span>
          <span>Full Effect</span>
        </div>
      </div>

      {/* Current Mode Info */}
      {simulationType !== 'normal' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1.5">
            {SIMULATION_INFO[simulationType].name}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {SIMULATION_INFO[simulationType].description}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Controls;

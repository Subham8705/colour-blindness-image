import { motion } from 'framer-motion';
import { SimulationType, SIMULATION_INFO } from '@/utils/colorTransforms';

interface ControlsProps {
  simulationType: SimulationType;
  onSimulationChange: (type: SimulationType) => void;
  intensity: number;
  onIntensityChange: (value: number) => void;
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
}: ControlsProps) => {
  return (
    <div className="space-y-5">
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

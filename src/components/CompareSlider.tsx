import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface CompareSliderProps {
  position: number;
  onPositionChange: (position: number) => void;
  width: number;
  height: number;
  children: React.ReactNode;
}

const CompareSlider = ({
  position,
  onPositionChange,
  width,
  height,
  children,
}: CompareSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    onPositionChange(percentage);
  }, [onPositionChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMove]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);

    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [handleMove]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onPositionChange(Math.max(0, position - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onPositionChange(Math.min(100, position + step));
    }
  }, [position, onPositionChange]);

  return (
    <div
      ref={containerRef}
      className="relative cursor-col-resize select-none"
      style={{ width, height }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="slider"
      aria-label="Comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      aria-valuetext={`${Math.round(position)}% original, ${Math.round(100 - position)}% simulated`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {children}
      
      {/* Slider handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-0.5 -translate-x-1/2"
        style={{ 
          left: `${position}%`,
          background: 'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
        }}
        animate={{
          boxShadow: isDragging 
            ? '0 0 20px 2px hsl(var(--primary) / 0.4)' 
            : '0 0 10px 1px hsl(var(--primary) / 0.2)',
        }}
      >
        {/* Handle grip */}
        <motion.div
          animate={{
            scale: isDragging ? 1.1 : 1,
            boxShadow: isDragging 
              ? 'var(--shadow-glow)' 
              : 'var(--shadow-md)',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-14 rounded-full bg-gradient-to-b from-primary to-primary/90 flex items-center justify-center border-2 border-primary-foreground/20"
        >
          <GripVertical className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CompareSlider;

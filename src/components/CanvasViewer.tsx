import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { SimulationType, applySimulation, applyDaltonization, calculatePreviewDimensions } from '@/utils/colorTransforms';
import CompareSlider from './CompareSlider';

interface CanvasViewerProps {
  sourceImage: HTMLImageElement | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isWebcamActive: boolean;
  simulationType: SimulationType;
  intensity: number;
  onProcessedImageReady: (canvas: HTMLCanvasElement) => void;
  mode?: 'simulate' | 'correct';
}

const MAX_PREVIEW_WIDTH = 800;
const MAX_PREVIEW_HEIGHT = 600;
const WEBCAM_FPS = 15;

const CanvasViewer = ({
  sourceImage,
  videoRef,
  isWebcamActive,
  simulationType,
  intensity,
  onProcessedImageReady,
  mode = 'simulate',
}: CanvasViewerProps) => {
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const simulatedCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastProcessTimeRef = useRef<number>(0);

  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const [sliderPosition, setSliderPosition] = useState(50);

  const processFrame = useCallback((source: HTMLImageElement | HTMLVideoElement) => {
    const originalCanvas = originalCanvasRef.current;
    const simulatedCanvas = simulatedCanvasRef.current;

    if (!originalCanvas || !simulatedCanvas) return;

    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });
    const simulatedCtx = simulatedCanvas.getContext('2d', { willReadFrequently: true });

    if (!originalCtx || !simulatedCtx) return;

    const sourceWidth = source instanceof HTMLImageElement ? source.naturalWidth : source.videoWidth;
    const sourceHeight = source instanceof HTMLImageElement ? source.naturalHeight : source.videoHeight;

    if (sourceWidth === 0 || sourceHeight === 0) return;

    const { width, height } = calculatePreviewDimensions(
      sourceWidth,
      sourceHeight,
      MAX_PREVIEW_WIDTH,
      MAX_PREVIEW_HEIGHT
    );

    if (originalCanvas.width !== width || originalCanvas.height !== height) {
      originalCanvas.width = width;
      originalCanvas.height = height;
      simulatedCanvas.width = width;
      simulatedCanvas.height = height;
      setDimensions({ width, height });
    }

    originalCtx.drawImage(source, 0, 0, width, height);

    const imageData = originalCtx.getImageData(0, 0, width, height);

    // Apply simulation or correction
    const simulatedData = mode === 'correct'
      ? applyDaltonization(imageData, simulationType, intensity)
      : applySimulation(imageData, simulationType, intensity);

    simulatedCtx.putImageData(simulatedData, 0, 0);

    onProcessedImageReady(simulatedCanvas);
  }, [simulationType, intensity, onProcessedImageReady, mode]);

  useEffect(() => {
    if (!isWebcamActive || !videoRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const video = videoRef.current;
    const frameInterval = 1000 / WEBCAM_FPS;

    const processWebcamFrame = (timestamp: number) => {
      if (timestamp - lastProcessTimeRef.current >= frameInterval) {
        if (video.readyState >= video.HAVE_CURRENT_DATA) {
          processFrame(video);
        }
        lastProcessTimeRef.current = timestamp;
      }
      animationFrameRef.current = requestAnimationFrame(processWebcamFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processWebcamFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isWebcamActive, videoRef, processFrame]);

  useEffect(() => {
    if (sourceImage && !isWebcamActive) {
      processFrame(sourceImage);
    }
  }, [sourceImage, isWebcamActive, processFrame]);

  const hasContent = sourceImage || isWebcamActive;

  if (!hasContent) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="canvas-container flex items-center justify-center h-80 bg-gradient-to-br from-canvas to-secondary/30"
      >
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border">
            <svg className="w-10 h-10 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            Upload an image or enable webcam
          </p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            to start simulating color blindness
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      ref={containerRef}
      className="canvas-container relative overflow-hidden"
    >
      <CompareSlider
        position={sliderPosition}
        onPositionChange={setSliderPosition}
        width={dimensions.width}
        height={dimensions.height}
      >
        <canvas
          ref={originalCanvasRef}
          className="absolute top-0 left-0"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
          aria-label="Original image"
        />

        <canvas
          ref={simulatedCanvasRef}
          className="absolute top-0 left-0"
          style={{
            clipPath: `inset(0 0 0 ${sliderPosition}%)`,
          }}
          aria-label="Simulated image showing color blindness view"
        />
      </CompareSlider>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-foreground/90 backdrop-blur-sm text-background text-xs font-medium shadow-lg">
        Original
      </div>
      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-primary backdrop-blur-sm text-primary-foreground text-xs font-medium shadow-lg">
        {mode === 'correct' ? 'Corrected' : 'Simulated'}
      </div>
    </motion.div>
  );
};

export default CanvasViewer;

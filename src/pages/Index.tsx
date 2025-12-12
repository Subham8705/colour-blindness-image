import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SimulationType, applySimulation, applyDaltonization } from '@/utils/colorTransforms';
import Header from '@/components/Header';
import Controls from '@/components/Controls';
import Uploader from '@/components/Uploader';
import WebcamToggle from '@/components/WebcamToggle';
import CanvasViewer from '@/components/CanvasViewer';
import ActionButtons from '@/components/ActionButtons';
import InfoPanel from '@/components/InfoPanel';
import Footer from '@/components/Footer';

const Index = () => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [simulationType, setSimulationType] = useState<SimulationType>('deuteranopia');
  const [mode, setMode] = useState<'simulate' | 'correct'>('simulate');
  const [intensity, setIntensity] = useState(100);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isWebcamLoading, setIsWebcamLoading] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [debouncedIntensity, setDebouncedIntensity] = useState(intensity);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedIntensity(intensity);
    }, 50);
    return () => clearTimeout(timer);
  }, [intensity]);

  const toggleWebcam = useCallback(async () => {
    if (isWebcamActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsWebcamActive(false);
      setWebcamError(null);
    } else {
      setIsWebcamLoading(true);
      setWebcamError(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
        });

        if (!videoRef.current) {
          videoRef.current = document.createElement('video');
          videoRef.current.playsInline = true;
          videoRef.current.muted = true;
        }

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        streamRef.current = stream;
        setSourceImage(null);
        setIsWebcamActive(true);
      } catch (err) {
        console.error('Webcam error:', err);
        setWebcamError(
          err instanceof DOMException && err.name === 'NotAllowedError'
            ? 'Camera access was denied. Please allow camera access in your browser settings.'
            : 'Unable to access camera. Please ensure your device has a camera and try again.'
        );
      } finally {
        setIsWebcamLoading(false);
      }
    }
  }, [isWebcamActive]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleImageLoad = useCallback((image: HTMLImageElement) => {
    if (isWebcamActive) {
      toggleWebcam();
    }
    setSourceImage(image);
  }, [isWebcamActive, toggleWebcam]);

  const handleClear = useCallback(() => {
    setSourceImage(null);
    if (isWebcamActive) {
      toggleWebcam();
    }
  }, [isWebcamActive, toggleWebcam]);

  const handleReset = useCallback(() => {
    handleClear();
    setSimulationType('deuteranopia');
    setIntensity(100);
  }, [handleClear]);

  const handleProcessedImageReady = useCallback((canvas: HTMLCanvasElement) => {
    processedCanvasRef.current = canvas;
  }, []);

  const handleDownload = useCallback(() => {
    if (!sourceImage || !processedCanvasRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) return;

    canvas.width = sourceImage.naturalWidth;
    canvas.height = sourceImage.naturalHeight;

    ctx.drawImage(sourceImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const simulatedData = applySimulation(imageData, simulationType, debouncedIntensity);

    ctx.putImageData(simulatedData, 0, 0);

    const link = document.createElement('a');
    link.download = `colorblind-simulation-${simulationType}-${debouncedIntensity}pct.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [sourceImage, simulationType, debouncedIntensity]);

  const hasContent = sourceImage || isWebcamActive;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-xl"
      >
        Skip to main content
      </a>

      <div className="flex-1 container mx-auto px-4 py-6 space-y-5 max-w-7xl">
        <Header onInfoClick={() => setIsInfoOpen(true)} />

        <main id="main-content" className="grid lg:grid-cols-[340px_1fr] gap-5">
          {/* Controls Panel */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-5 lg:order-1"
          >
            <div className="glass-panel p-6 space-y-6">
              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Image Source
                </h2>
                <div className="space-y-4">
                  <Uploader
                    onImageLoad={handleImageLoad}
                    hasImage={!!sourceImage}
                    onClear={handleClear}
                  />

                  <div className="relative py-2">
                    <div className="section-divider" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-card px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                        or
                      </span>
                    </div>
                  </div>

                  <WebcamToggle
                    isActive={isWebcamActive}
                    onToggle={toggleWebcam}
                    isLoading={isWebcamLoading}
                    error={webcamError}
                  />
                </div>
              </div>

              <div className="section-divider" />

              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Simulation
                </h2>
                <Controls
                  simulationType={simulationType}
                  onSimulationChange={setSimulationType}
                  intensity={intensity}
                  onIntensityChange={setIntensity}
                  mode={mode}
                  onModeChange={setMode}
                />
              </div>

              <div className="section-divider" />

              <div>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Export
                </h2>
                <ActionButtons
                  onDownload={handleDownload}
                  onReset={handleReset}
                  canDownload={Boolean(sourceImage) && !isWebcamActive}
                  canReset={Boolean(hasContent)}
                />
              </div>
            </div>
          </motion.aside>

          {/* Canvas Viewer */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:order-2"
          >
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Preview
                </h2>
                {hasContent && (
                  <p className="text-xs text-muted-foreground">
                    Drag slider to compare
                  </p>
                )}
              </div>
              <CanvasViewer
                sourceImage={sourceImage}
                videoRef={videoRef}
                isWebcamActive={isWebcamActive}
                simulationType={simulationType}
                mode={mode}
                intensity={debouncedIntensity}
                onProcessedImageReady={handleProcessedImageReady}
              />
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>

      <InfoPanel isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div >
  );
};

export default Index;

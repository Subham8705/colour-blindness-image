import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, CheckCircle, ArrowRight } from 'lucide-react';

interface UploaderProps {
  onImageLoad: (image: HTMLImageElement) => void;
  hasImage: boolean;
  onClear: () => void;
}

const DEMO_IMAGES = [
  {
    id: 'fruit',
    url: '/fruit.jpg',
    label: 'Vibrant Fruit',
    desc: 'Test red/green differentiation'
  },
  {
    id: 'traffic',
    url: '/traffic-light.jpg',
    label: 'Traffic Light',
    desc: 'Critical safety signals'
  },
  {
    id: 'nature',
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    label: 'Forest Landscape',
    desc: 'Rich greens and earth tones'
  }
];

const Uploader = ({ onImageLoad, hasImage, onClear }: UploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image size must be less than 20MB');
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      onImageLoad(img);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      setError('Failed to load image. Please try another file.');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, [onImageLoad]);

  const handleDemoSelect = useCallback((demo: typeof DEMO_IMAGES[0]) => {
    setLoadingDemo(demo.id);
    setError(null);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      onImageLoad(img);
      setLoadingDemo(null);
    };

    img.onerror = () => {
      setError(`Failed to load demo image: ${demo.label}`);
      setLoadingDemo(null);
    };

    img.src = demo.url;
  }, [onImageLoad]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  }, [processFile]);

  if (hasImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <CheckCircle className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">Image loaded</span>
            <p className="text-xs text-muted-foreground">Ready for simulation</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClear}
          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Remove image"
        >
          <X className="w-4 h-4 text-destructive" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`dropzone ${isDragging ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Upload image by drag and drop or click to browse"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              document.getElementById('file-input')?.click();
            }
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 mb-4"
            >
              <Upload className="w-8 h-8 text-primary" />
            </motion.div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop an image here
            </p>
            <p className="text-xs text-muted-foreground">
              or <span className="text-primary font-medium">browse</span> to upload
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-2 uppercase tracking-wide">
              JPG, PNG, GIF up to 20MB
            </p>
          </div>
        </motion.div>

        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Choose image file"
        />

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
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Start Demos
          </h3>
          <span className="text-[10px] text-muted-foreground/50">Click to load</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {DEMO_IMAGES.map((demo) => (
            <motion.button
              key={demo.id}
              onClick={() => handleDemoSelect(demo)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group overflow-hidden rounded-xl border border-border h-16 flex items-center text-left bg-card hover:border-primary/50 transition-colors"
              disabled={loadingDemo !== null}
            >
              <div className="w-16 h-full relative">
                <img
                  src={demo.url}
                  alt={demo.label}
                  className="w-full h-full object-cover"
                />
                {loadingDemo === demo.id && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1 px-3 py-2">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {demo.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {demo.desc}
                </p>
              </div>
              <div className="px-3 text-muted-foreground/30 group-hover:text-primary/50 group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Uploader;

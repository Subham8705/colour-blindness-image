import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, CheckCircle } from 'lucide-react';

interface UploaderProps {
  onImageLoad: (image: HTMLImageElement) => void;
  hasImage: boolean;
  onClear: () => void;
}

const Uploader = ({ onImageLoad, hasImage, onClear }: UploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  );
};

export default Uploader;
